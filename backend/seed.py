# seed.py
import json
from datetime import datetime, timedelta, timezone
from werkzeug.security import generate_password_hash
from app import app
from extensions import db
from models import User, Task

def seed_database():
    with app.app_context():
        print("🌱 Initializing database tables...")
        db.create_all()

        # ── Test Users ──
        test_users_data = [
            {
                "username": "demo",
                "email": "demo@taskify.pro",
                "password": generate_password_hash("Password123!"),
                "tasks": [
                    {
                        "title": "🚀 Launch Multiverse Station Artifact",
                        "description": "Finalize 3D interactive book carousel and dynamic depth parallax shaders.",
                        "priority": 4,  # Urgent
                        "status": "in_progress",
                        "category": "work",
                        "estimated_minutes": 45,
                        "due_date": datetime.now(timezone.utc) + timedelta(days=1),
                        "completed": False,
                        "subtasks": [
                            {"id": "1", "text": "Calibrate mouse drag physics", "completed": True},
                            {"id": "2", "text": "Verify mobile touch swipe responsiveness", "completed": True},
                            {"id": "3", "text": "Deploy to Vercel production edge", "completed": False}
                        ]
                    },
                    {
                        "title": "🕷️ Synthesize Web-Fluid Formula v4",
                        "description": "Blend high-tensile polymer with magnetic glitch charge for dimensional tethering.",
                        "priority": 3,  # High
                        "status": "todo",
                        "category": "learning",
                        "estimated_minutes": 30,
                        "due_date": datetime.now(timezone.utc) + timedelta(days=3),
                        "completed": False,
                        "subtasks": [
                            {"id": "1", "text": "Test tensile strength under 500kg pressure", "completed": False},
                            {"id": "2", "text": "Optimize rapid-evaporation solvent", "completed": False}
                        ]
                    },
                    {
                        "title": "📊 Review Sector 7 Gadget Budget",
                        "description": "Audit component costs for wrist blasters, HUD lens upgrades, and comic badges.",
                        "priority": 2,  # Medium
                        "status": "todo",
                        "category": "finance",
                        "estimated_minutes": 25,
                        "due_date": datetime.now(timezone.utc) + timedelta(days=5),
                        "completed": False,
                        "subtasks": [
                            {"id": "1", "text": "Compare vendor quotes for titanium alloy", "completed": True},
                            {"id": "2", "text": "Approve quarterly lab funding", "completed": False}
                        ]
                    },
                    {
                        "title": "🏃 Brooklyn Rooftop Agility Training",
                        "description": "Complete 10km rooftop sprint, wall-crawling interval reps, and 360 backflips.",
                        "priority": 3,  # High
                        "status": "completed",
                        "category": "health",
                        "estimated_minutes": 60,
                        "due_date": datetime.now(timezone.utc) - timedelta(days=1),
                        "completed": True,
                        "completed_at": datetime.now(timezone.utc) - timedelta(hours=12),
                        "subtasks": [
                            {"id": "1", "text": "5km warmup sprint", "completed": True},
                            {"id": "2", "text": "100 aerial web maneuvers", "completed": True}
                        ]
                    },
                    {
                        "title": "🍕 Grab Extra Cheese Pizza from Brooklyn Bros",
                        "description": "Pick up 2 large wood-fired pepperoni & extra mozzarella boxes before focus session.",
                        "priority": 1,  # Low
                        "status": "completed",
                        "category": "personal",
                        "estimated_minutes": 20,
                        "due_date": datetime.now(timezone.utc) - timedelta(days=2),
                        "completed": True,
                        "completed_at": datetime.now(timezone.utc) - timedelta(days=2),
                        "subtasks": [
                            {"id": "1", "text": "Call ahead for pickup", "completed": True},
                            {"id": "2", "text": "Grab garlic knots", "completed": True}
                        ]
                    },
                    {
                        "title": "📄 Export Mission PDF Dossier for Review",
                        "description": "Generate high-contrast comic report with ASCII stamps for headquarters archive.",
                        "priority": 2,  # Medium
                        "status": "todo",
                        "category": "work",
                        "estimated_minutes": 15,
                        "due_date": datetime.now(timezone.utc) + timedelta(hours=6),
                        "completed": False,
                        "subtasks": [
                            {"id": "1", "text": "Verify print stylesheet resolution", "completed": True},
                            {"id": "2", "text": "Generate sector metrics summary", "completed": False}
                        ]
                    }
                ]
            },
            {
                "username": "harsh",
                "email": "harsh@taskify.pro",
                "password": generate_password_hash("Password123!"),
                "tasks": [
                    {
                        "title": "⚡ Setup Railway PostgreSQL & Vercel Pipeline",
                        "description": "Link GitHub repo, configure environment variables, and verify live PWA installation.",
                        "priority": 4,
                        "status": "in_progress",
                        "category": "work",
                        "estimated_minutes": 30,
                        "due_date": datetime.now(timezone.utc) + timedelta(days=1),
                        "completed": False,
                        "subtasks": [
                            {"id": "1", "text": "Deploy PostgreSQL on Railway", "completed": True},
                            {"id": "2", "text": "Configure Vercel client-side routing", "completed": True},
                            {"id": "3", "text": "Run automated database seeder", "completed": True}
                        ]
                    },
                    {
                        "title": "🎯 Daily 25-Min Focus Sprint",
                        "description": "Run Pomodoro timer session to review all open pull requests and task cards.",
                        "priority": 3,
                        "status": "todo",
                        "category": "learning",
                        "estimated_minutes": 25,
                        "due_date": datetime.now(timezone.utc) + timedelta(hours=4),
                        "completed": False,
                        "subtasks": [
                            {"id": "1", "text": "Turn on Focus Mode", "completed": False},
                            {"id": "2", "text": "Log completed pomodoro cycle", "completed": False}
                        ]
                    }
                ]
            }
        ]

        created_users = 0
        created_tasks = 0

        for u_data in test_users_data:
            user = User.query.filter((User.username == u_data["username"]) | (User.email == u_data["email"])).first()
            if not user:
                user = User(
                    username=u_data["username"],
                    email=u_data["email"],
                    password=u_data["password"]
                )
                db.session.add(user)
                db.session.flush()
                created_users += 1
                print(f"  👤 Created user: {user.username} ({user.email})")

            for t_data in u_data["tasks"]:
                existing_task = Task.query.filter_by(user_id=user.id, title=t_data["title"]).first()
                if not existing_task:
                    task = Task(
                        title=t_data["title"],
                        description=t_data.get("description", ""),
                        priority=t_data.get("priority", 2),
                        status=t_data.get("status", "todo"),
                        category=t_data.get("category", "general"),
                        subtasks_json=json.dumps(t_data.get("subtasks", [])),
                        estimated_minutes=t_data.get("estimated_minutes", 25),
                        due_date=t_data.get("due_date"),
                        completed=t_data.get("completed", False),
                        completed_at=t_data.get("completed_at"),
                        user_id=user.id
                    )
                    db.session.add(task)
                    created_tasks += 1
                    print(f"    📋 Added task: {task.title}")

        db.session.commit()
        print(f"\n🎉 Database seeding complete! ({created_users} users created, {created_tasks} tasks created)")
        print("\n🔑 Test Credentials:")
        print("   1. Username: demo   | Password: Password123! | Email: demo@taskify.pro")
        print("   2. Username: harsh  | Password: Password123! | Email: harsh@taskify.pro")

if __name__ == '__main__':
    seed_database()
