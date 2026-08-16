from flask_mail import Mail, Message

mail = Mail()

def init_mail(app):
    mail.init_app(app)

def send_email(recipient, subject, body):
    msg = Message(subject=subject, recipients=[recipient], body=body)
    mail.send(msg)
