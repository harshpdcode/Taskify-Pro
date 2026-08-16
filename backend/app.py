# app.py
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask import Flask, jsonify
from extensions import db
import os
from mail_utils import init_mail
from flask_migrate import Migrate
from datetime import datetime, timedelta, timezone
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from limiter import limiter, init_app
from flask_cors import CORS
from auth import auth_bp
from mail_utils import init_mail  # ✅ import
load_dotenv() 

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
}, supports_credentials=True)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config.from_pyfile('config.py')  # Move configs to separate file

# Database URI (supports PostgreSQL on Railway and fallback SQLite for local dev)
db_url = os.getenv('DATABASE_URL')
if db_url:
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'instance', 'app.db')}"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'taskify-pro-super-secret-key-2026')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'taskify-pro-jwt-secret-key-2026')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  # Token expiration
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)  # Refresh token expiration
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_COOKIE_SECURE'] = False  # For local dev, HTTP only
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Enable CSRF protection
# Prevent CSRF attacks
app.config['JWT_CSRF_CHECK_FORM'] = True

# Only send cookies over HTTPS


# Limit token side-jacking
app.config['JWT_SESSION_COOKIE'] = False  


# Initialize DB
db.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)
# Import and register blueprints
from auth import auth_bp
from task import tasks_bp
init_mail(app)


# THEN import and init blueprints
from auth import auth_bp


app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(tasks_bp, url_prefix='/api')

init_app(app)

# Create tables & migrate column lengths
with app.app_context():
    from sqlalchemy import text
    if not os.path.exists(os.path.join(basedir, 'instance')):
        os.makedirs(os.path.join(basedir, 'instance'))
    db.create_all()
    try:
        db.session.execute(text('ALTER TABLE "user" ALTER COLUMN password TYPE VARCHAR(512);'))
        db.session.execute(text('ALTER TABLE "user" ALTER COLUMN reset_token TYPE VARCHAR(512);'))
        db.session.execute(text('ALTER TABLE "user" ALTER COLUMN email TYPE VARCHAR(255);'))
        db.session.commit()
    except Exception:
        db.session.rollback()
@app.errorhandler(422)
def handle_unprocessable_entity(err):
    return jsonify({
        "error": "Token validation failed",
        "message": str(err.description)
    }), 422
@app.errorhandler(404)
def not_found(e):
    return jsonify(error=str(e)), 404

@app.route('/', methods=['GET'])
@app.route('/api', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "service": "Taskify Pro Multiverse API",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }), 200

@app.route('/api/seed', methods=['GET', 'POST'])
def auto_seed():
    try:
        from seed import seed_database
        seed_database()
        return jsonify({
            "status": "success",
            "message": "Database seeded successfully with test users and tasks!",
            "test_accounts": [
                {"username": "demo", "email": "demo@taskify.pro", "password": "Password123!"},
                {"username": "harsh", "email": "harsh@taskify.pro", "password": "Password123!"}
            ]
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
limiter.init_app(app)
limiter.enabled = not app.debug

if __name__ == '__main__':
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        storage_uri="memory://",
        enabled=not app.debug
    )
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)