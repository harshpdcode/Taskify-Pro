# task.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Task
from datetime import datetime, timezone
import json

tasks_bp = Blueprint('tasks', __name__)

def parse_date(date_val):
    if not date_val:
        return None
    if isinstance(date_val, datetime):
        return date_val
    try:
        clean_str = str(date_val).replace('Z', '')
        if '+' in clean_str:
            clean_str = clean_str.split('+')[0]
        return datetime.fromisoformat(clean_str)
    except Exception:
        return None

def is_date_overdue(due_date):
    if not due_date:
        return False
    if due_date.tzinfo is not None:
        return due_date < datetime.now(timezone.utc)
    return due_date < datetime.utcnow()

def task_to_dict(task):
    subtasks = []
    if task.subtasks_json:
        try:
            subtasks = json.loads(task.subtasks_json)
        except Exception:
            subtasks = []

    return {
        'id': task.id,
        'title': task.title,
        'description': task.description or '',
        'priority': task.priority if task.priority is not None else 2,
        'status': task.status or ('completed' if task.completed else 'todo'),
        'category': task.category or 'general',
        'subtasks': subtasks,
        'estimated_minutes': task.estimated_minutes or 25,
        'completed': bool(task.completed or (task.status == 'completed')),
        'due_date': task.due_date.isoformat() if task.due_date else None,
        'completed_at': task.completed_at.isoformat() if task.completed_at else None,
        'created_at': task.created_at.isoformat() if task.created_at else None,
        'updated_at': task.updated_at.isoformat() if task.updated_at else None
    }

@tasks_bp.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    query = Task.query.filter_by(user_id=user_id)

    status = request.args.get('status')
    category = request.args.get('category')
    priority = request.args.get('priority')
    search = request.args.get('search')
    sort_by = request.args.get('sort_by', 'created_at')
    order = request.args.get('order', 'desc')

    if status and status != 'all':
        if status == 'completed':
            query = query.filter((Task.completed == True) | (Task.status == 'completed'))
        elif status == 'pending':
            query = query.filter((Task.completed == False) & (Task.status != 'completed'))
        else:
            query = query.filter_by(status=status)

    if category and category != 'all':
        query = query.filter_by(category=category)

    if priority and priority != 'all':
        try:
            query = query.filter_by(priority=int(priority))
        except ValueError:
            pass

    if search:
        search_term = f"%{search}%"
        query = query.filter((Task.title.ilike(search_term)) | (Task.description.ilike(search_term)))

    if sort_by == 'due_date':
        query = query.order_by(Task.due_date.desc() if order == 'desc' else Task.due_date.asc())
    elif sort_by == 'priority':
        query = query.order_by(Task.priority.desc() if order == 'desc' else Task.priority.asc())
    elif sort_by == 'title':
        query = query.order_by(Task.title.desc() if order == 'desc' else Task.title.asc())
    else:
        query = query.order_by(Task.created_at.desc() if order == 'desc' else Task.created_at.asc())

    tasks = query.all()
    return jsonify([task_to_dict(t) for t in tasks]), 200

@tasks_bp.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400

    due_date = parse_date(data.get('due_date'))

    subtasks_str = '[]'
    if 'subtasks' in data:
        if isinstance(data['subtasks'], list):
            subtasks_str = json.dumps(data['subtasks'])
        elif isinstance(data['subtasks'], str):
            subtasks_str = data['subtasks']

    status = data.get('status', 'todo')
    completed = bool(data.get('completed', False) or status == 'completed')

    new_task = Task(
        title=data['title'].strip(),
        description=data.get('description', '').strip(),
        priority=int(data.get('priority', 2)),
        status='completed' if completed else status,
        category=data.get('category', 'general').lower(),
        subtasks_json=subtasks_str,
        estimated_minutes=int(data.get('estimated_minutes', 25)),
        due_date=due_date,
        completed=completed,
        completed_at=datetime.utcnow() if completed else None,
        user_id=user_id
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task created', 'task': task_to_dict(new_task)}), 201

@tasks_bp.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No payload provided'}), 400

    if 'title' in data and data['title']:
        task.title = data['title'].strip()
    if 'description' in data:
        task.description = data['description']
    if 'priority' in data:
        task.priority = int(data['priority'])
    if 'category' in data:
        task.category = data['category'].lower()
    if 'estimated_minutes' in data:
        task.estimated_minutes = int(data['estimated_minutes'])

    if 'subtasks' in data:
        if isinstance(data['subtasks'], list):
            task.subtasks_json = json.dumps(data['subtasks'])
        elif isinstance(data['subtasks'], str):
            task.subtasks_json = data['subtasks']

    if 'due_date' in data:
        task.due_date = parse_date(data['due_date'])

    if 'status' in data:
        task.status = data['status']
        if data['status'] == 'completed':
            task.completed = True
            if not task.completed_at:
                task.completed_at = datetime.utcnow()
        else:
            task.completed = False
            task.completed_at = None

    if 'completed' in data:
        task.completed = bool(data['completed'])
        if task.completed:
            task.status = 'completed'
            if not task.completed_at:
                task.completed_at = datetime.utcnow()
        else:
            if task.status == 'completed':
                task.status = 'todo'
            task.completed_at = None

    task.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'Task updated', 'task': task_to_dict(task)}), 200

@tasks_bp.route('/tasks/<int:task_id>/toggle', methods=['POST'])
@jwt_required()
def toggle_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    task.completed = not task.completed
    if task.completed:
        task.status = 'completed'
        task.completed_at = datetime.utcnow()
    else:
        task.status = 'todo'
        task.completed_at = None

    task.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'Task toggled', 'task': task_to_dict(task)}), 200

@tasks_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted', 'id': task_id}), 200

@tasks_bp.route('/tasks/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = get_jwt_identity()
    tasks = Task.query.filter_by(user_id=user_id).all()

    total = len(tasks)
    completed = sum(1 for t in tasks if t.completed or t.status == 'completed')
    pending = total - completed
    in_progress = sum(1 for t in tasks if t.status == 'in_progress')
    in_review = sum(1 for t in tasks if t.status == 'in_review')
    todo = sum(1 for t in tasks if (t.status == 'todo' or not t.status) and not t.completed)

    # Priority counts
    priority_counts = {
        'low': sum(1 for t in tasks if t.priority == 1),
        'medium': sum(1 for t in tasks if t.priority == 2 or t.priority is None),
        'high': sum(1 for t in tasks if t.priority == 3),
        'urgent': sum(1 for t in tasks if t.priority == 4)
    }

    # Category breakdown
    category_counts = {}
    for t in tasks:
        cat = (t.category or 'general').lower()
        category_counts[cat] = category_counts.get(cat, 0) + 1

    # Overdue tasks
    overdue = sum(1 for t in tasks if t.due_date and not t.completed and is_date_overdue(t.due_date))

    completion_rate = round((completed / total * 100), 1) if total > 0 else 0

    return jsonify({
        'total': total,
        'completed': completed,
        'pending': pending,
        'todo': todo,
        'in_progress': in_progress,
        'in_review': in_review,
        'overdue': overdue,
        'completion_rate': completion_rate,
        'priority_counts': priority_counts,
        'category_counts': category_counts,
    }), 200

@tasks_bp.route('/tasks/bulk', methods=['POST'])
@jwt_required()
def bulk_action():
    user_id = get_jwt_identity()
    data = request.get_json()
    action = data.get('action')

    if not action:
        return jsonify({'error': 'Action required'}), 400

    if action == 'delete_all_completed':
        tasks = Task.query.filter_by(user_id=user_id).filter((Task.completed == True) | (Task.status == 'completed')).all()
        for t in tasks:
            db.session.delete(t)
        db.session.commit()
        return jsonify({'message': f'Deleted {len(tasks)} completed tasks'}), 200

    if action == 'mark_all_completed':
        tasks = Task.query.filter_by(user_id=user_id, completed=False).all()
        for t in tasks:
            t.completed = True
            t.status = 'completed'
            t.completed_at = datetime.utcnow()
        db.session.commit()
        return jsonify({'message': f'Marked {len(tasks)} tasks as completed'}), 200

    if action == 'import_tasks' and 'tasks' in data:
        imported = 0
        for item in data['tasks']:
            if not item.get('title'):
                continue
            new_t = Task(
                title=item['title'].strip(),
                description=item.get('description', ''),
                priority=int(item.get('priority', 2)),
                status=item.get('status', 'todo'),
                category=item.get('category', 'general').lower(),
                completed=bool(item.get('completed', False)),
                user_id=user_id
            )
            db.session.add(new_t)
            imported += 1
        db.session.commit()
        return jsonify({'message': f'Successfully imported {imported} tasks'}), 201

    return jsonify({'error': 'Invalid bulk action'}), 400