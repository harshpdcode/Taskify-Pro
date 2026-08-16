# app.py
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask import Flask, jsonify
from extensions import db
import os
from mail_utils import init_mail
from flask_migrate import Migrate
from datetime import timedelta, timezone
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
        "origins": [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:4173",
            "http://127.0.0.1:4173",
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
}, supports_credentials=True, origins=r"http://.*:5173")


basedir = os.path.abspath(os.path.dirname(__file__))
app.config.from_pyfile('config.py')  # Move configs to separate file

# Config
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'instance', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
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

# Create tables
with app.app_context():
    if not os.path.exists(os.path.join(basedir, 'instance')):
        os.makedirs(os.path.join(basedir, 'instance'))
    db.create_all()
@app.errorhandler(422)
def handle_unprocessable_entity(err):
    return jsonify({
        "error": "Token validation failed",
        "message": str(err.description)
    }), 422
@app.errorhandler(404)
def not_found(e):
    return jsonify(error=str(e)), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify(error="Internal server error"), 500
limiter.init_app(app)
limiter.enabled = not app.debug

if __name__ == '__main__':
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        storage_uri="memory://",
        enabled=not app.debug
    )
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=True)