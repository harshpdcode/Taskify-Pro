# models.py
from datetime import datetime, timezone
from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(512), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    reset_token = db.Column(db.String(512), nullable=True)
    reset_token_exp = db.Column(db.DateTime, nullable=True)
    tasks = db.relationship('Task', backref='user', lazy=True)

    def __init__(self, username=None, email=None, password=None, reset_token=None, reset_token_exp=None, **kwargs):
        super().__init__(**kwargs)
        if username is not None:
            self.username = username
        if email is not None:
            self.email = email
        if password is not None:
            self.password = password
        if reset_token is not None:
            self.reset_token = reset_token
        if reset_token_exp is not None:
            self.reset_token_exp = reset_token_exp

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    priority = db.Column(db.Integer, default=2)  # 1=Low, 2=Medium, 3=High, 4=Urgent
    status = db.Column(db.String(30), default='todo')  # todo, in_progress, in_review, completed
    category = db.Column(db.String(50), default='general')  # work, personal, finance, learning, health, general
    subtasks_json = db.Column(db.Text, default='[]')  # JSON array string: [{"id": "1", "text": "...", "completed": false}]
    estimated_minutes = db.Column(db.Integer, default=25)
    due_date = db.Column(db.DateTime, nullable=True)
    completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def __init__(
        self,
        title=None,
        description=None,
        priority=2,
        status='todo',
        category='general',
        subtasks_json='[]',
        estimated_minutes=25,
        due_date=None,
        completed=False,
        completed_at=None,
        user_id=None,
        **kwargs
    ):
        super().__init__(**kwargs)
        if title is not None:
            self.title = title
        if description is not None:
            self.description = description
        self.priority = priority
        self.status = status
        self.category = category
        self.subtasks_json = subtasks_json
        self.estimated_minutes = estimated_minutes
        self.due_date = due_date
        self.completed = completed
        self.completed_at = completed_at
        if user_id is not None:
            self.user_id = user_id