#config.py
import os

basedir = os.path.abspath(os.path.dirname(__file__))

# Database
SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(basedir, 'instance', 'app.db')}"
SQLALCHEMY_TRACK_MODIFICATIONS = False

# JWT
SECRET_KEY = os.getenv('SECRET_KEY')
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour in seconds
JWT_TOKEN_LOCATION = ['headers']
JWT_COOKIE_SECURE = True
JWT_COOKIE_CSRF_PROTECT = True
JWT_SESSION_COOKIE = False
# ✅ Flask-Mail (Gmail SMTP)
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_TLS = True
MAIL_USERNAME = 'pandyaharsh8124@gmail.com'       # Replace with your Gmail
MAIL_PASSWORD = 'ufxj ziar wgwh rvzp'          # Use app-specific password
MAIL_DEFAULT_SENDER = MAIL_USERNAME
