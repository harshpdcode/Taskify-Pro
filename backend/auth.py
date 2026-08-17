#auth.py
from sqlite3 import IntegrityError
from limiter import limiter
from flask_limiter import Limiter
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    create_refresh_token,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies
)
from mail_utils import send_email
from extensions import db
from models import User
import re
from datetime import datetime, timedelta
import secrets

from mail_utils import send_email



def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

auth_bp = Blueprint('auth', __name__)
otp_store = {}
otp_verified = set()  

@auth_bp.before_request
@limiter.limit("60/minute", methods=["POST"])
def before_auth_request():
    pass  # Just for rate limiting

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()  # Gets the string identity
    user = User.query.get(int(current_user_id))  # Convert back to int for query
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    return jsonify({
        "message": "Access granted",
        "user_id": current_user_id,
        "username": user.username
    }), 200
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def user_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    response_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email
    }
    
    # Only include if the field exists
    if hasattr(user, 'created_at') and user.created_at:
        response_data["member_since"] = user.created_at.isoformat()
        
    return jsonify(response_data), 200
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user)
        response = jsonify({"access_token": new_token})
        set_access_cookies(response, new_token)
        return response, 200
    except Exception as e:
        print(f"Refresh error: {str(e)}")
        return jsonify({"error": "Token refresh failed"}), 422

@auth_bp.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "API is running"}), 200

@auth_bp.route('/users', methods=['GET'])
def get_users():    
    users = User.query.all()
    return jsonify([{"id": user.id, "username": user.username} for user in users])

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validation
        if not data or not all(k in data for k in ['username', 'email', 'password']):
            return jsonify({"error": "Missing username, email, or password"}), 400

        username = str(data.get('username') or '').strip()
        email = str(data.get('email') or '').strip()
        password = str(data.get('password') or '')

        if not username or not email or not password:
            return jsonify({"error": "Username, email, and password cannot be empty"}), 400

        if User.query.filter(db.func.lower(User.username) == username.lower()).first():
            return jsonify({"error": "Username already exists"}), 409

        if User.query.filter(db.func.lower(User.email) == email.lower()).first():
            return jsonify({"error": "Email already registered"}), 409
        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400
            
        # Create user
        hashed_password = generate_password_hash(password)
        new_user = User(
            username=username,
            email=email,
            password=hashed_password,
            reset_token=None,
            reset_token_exp=None
        )
        
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
        
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def validate_password(password):
    if len(password) < 8:
        return False
    return True

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Login request data:", data)  # Debug

        if not data:
            return jsonify({"error": "No data provided"}), 400

        identifier = str(data.get('username') or '').strip()  # could be username or email
        password = str(data.get('password') or '')

        if not identifier or not password:
            return jsonify({"error": "Username/email and password required"}), 400

        # Find user by username or email (case-insensitive & whitespace trimmed)
        user = User.query.filter(
            (db.func.lower(User.username) == identifier.lower()) |
            (db.func.lower(User.email) == identifier.lower())
        ).first()

        if not user:
            print(f"User not found for identifier: {identifier}")
            return jsonify({"error": "Invalid credentials"}), 401

        if not check_password_hash(user.password, password):
            print(f"Password mismatch for user: {user.username}")
            return jsonify({"error": "Invalid credentials"}), 401

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        response = jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "message": "Login successful",
            "user_id": user.id,
            "username": user.username
        })

        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)

        print(f"Login successful for user: {user.username}")
        return response, 200

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"error": "Login failed"}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)
    return response, 200

@auth_bp.route('/request-reset', methods=['POST'])
def request_reset():
    # Generate/send reset token
    pass



@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "created_at": user.created_at.isoformat()
    }), 200

# ✅ Update username/email
@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    username = data.get("username")
    email = data.get("email")

    if not username or not email:
        return jsonify({"error": "Username and email are required"}), 400

    user.username = username
    user.email = email
    db.session.commit()

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }), 200

# ✅ Update password via current password
@auth_bp.route('/profile/password', methods=['PUT'])
@jwt_required()
def change_password():
    user = User.query.get(get_jwt_identity())
    data = request.get_json()
    if not check_password_hash(user.password, data.get("current_password")):
        return jsonify({"error": "Incorrect current password"}), 403

    user.password = generate_password_hash(data["new_password"])
    db.session.commit()
    return jsonify({"message": "Password changed successfully"}), 200

@auth_bp.route('/profile/request-otp', methods=['POST'])
def request_otp():
    data = request.get_json()
    email = data.get("email")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    otp = secrets.token_hex(3)
    otp_store[email] = {"otp": otp, "expires": datetime.utcnow() + timedelta(minutes=5)}
    send_email(recipient=email, subject="Your OTP Code", body=f"Your OTP is: {otp}")  # ✅ Real email
    return jsonify({"message": "OTP sent to your email"}), 200
@auth_bp.route('/profile/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email, otp = data.get("email"), data.get("otp")
    record = otp_store.get(email)

    if not record:
        return jsonify({"error": "No OTP found"}), 400
    if datetime.utcnow() > record["expires"]:
        del otp_store[email]
        return jsonify({"error": "OTP expired"}), 400
    if record["otp"] != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    # ✅ Mark email as verified
    otp_verified.add(email)
    del otp_store[email]

    return jsonify({"message": "OTP verified"}), 200
@auth_bp.route('/profile/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('new_password')

    if email not in otp_verified:
        return jsonify({"error": "OTP not verified"}), 403

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.password = generate_password_hash(new_password)
    db.session.commit()

    otp_verified.remove(email)
    return jsonify({"message": "Password reset successful"}), 200
# ✅ Send OTP to current email before changing it
# Step 1: Request OTP to CURRENT email (identity verification)
@auth_bp.route('/profile/change-email/request-otp', methods=['POST'])
@jwt_required()
def request_change_email_current_otp():
    user = User.query.get(get_jwt_identity())
    otp = secrets.token_hex(3)
    otp_store[user.email] = {"otp": otp, "expires": datetime.utcnow() + timedelta(minutes=5)}

    send_email(
        recipient=user.email,
        subject="Verify Your Identity",
        body=f"Your OTP to change email is: {otp}"
    )
    return jsonify({"message": "OTP sent to current email"}), 200


# Step 2: Verify OTP sent to current email
@auth_bp.route('/profile/change-email/verify-current', methods=['POST'])
@jwt_required()
def verify_change_email_current():
    user = User.query.get(get_jwt_identity())
    data = request.get_json()
    otp = data.get("otp")

    record = otp_store.get(user.email)
    if not record or datetime.utcnow() > record["expires"]:
        return jsonify({"error": "OTP expired or not found"}), 400
    if record["otp"] != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    otp_verified.add(user.email)
    del otp_store[user.email]
    return jsonify({"message": "Current email verified. Proceed to enter new email."}), 200


# Step 3: Send OTP to NEW email
@auth_bp.route('/profile/change-email/request-new', methods=['POST'])
@jwt_required()
def request_change_email_new_otp():
    data = request.get_json()
    new_email = data.get("new_email")

    if User.query.filter_by(email=new_email).first():
        return jsonify({"error": "Email already exists"}), 409

    otp = secrets.token_hex(3)
    otp_store[new_email] = {"otp": otp, "expires": datetime.utcnow() + timedelta(minutes=5)}

    send_email(
        recipient=new_email,
        subject="Confirm Your New Email",
        body=f"Your OTP to confirm new email is: {otp}"
    )
    return jsonify({"message": "OTP sent to new email"}), 200


# Step 4: Final verification and update
@auth_bp.route('/profile/change-email/verify-new', methods=['PUT'])
@jwt_required()
def verify_new_email_and_update():
    user = User.query.get(get_jwt_identity())
    data = request.get_json()
    new_email = data.get("new_email")
    otp = data.get("otp")

    if user.email not in otp_verified:
        return jsonify({"error": "Current email not verified yet"}), 403

    record = otp_store.get(new_email)
    if not record or datetime.utcnow() > record["expires"]:
        return jsonify({"error": "OTP expired or not found"}), 400
    if record["otp"] != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    user.email = new_email
    db.session.commit()

    otp_verified.discard(user.email)
    del otp_store[new_email]

    return jsonify({"message": "Email updated successfully"}), 200



# ✅ Verify OTP and update email
@auth_bp.route('/profile/change-email', methods=['PUT'])
@jwt_required()
def change_email_with_otp():
    user = User.query.get(get_jwt_identity())
    data = request.get_json()
    new_email = data.get("new_email")
    otp = data.get("otp")

    if not new_email or not otp:
        return jsonify({"error": "New email and OTP required"}), 400

    record = otp_store.get(user.email)
    if not record:
        return jsonify({"error": "No OTP found"}), 400

    if datetime.utcnow() > record['expires']:
        del otp_store[user.email]
        return jsonify({"error": "OTP expired"}), 400

    if record["otp"] != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    if User.query.filter_by(email=new_email).first():
        return jsonify({"error": "Email already in use"}), 409

    old_email = user.email
    user.email = new_email
    db.session.commit()
    del otp_store[old_email]

    return jsonify({"message": "Email updated successfully"}), 200

