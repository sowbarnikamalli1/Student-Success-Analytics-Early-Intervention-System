# recommendations/engine.py

from .models import Recommendation
from apps.goals.models import Goal
from apps.accounts.models import Student

def generate_recommendations_for_student(student: Student):
    """
    Generate recommendations for a given student.
    This is a simple example logic; you can replace it with ML-based predictions or rules.
    """
    recommendations = []

    # Example: Check if student has goals, and recommend action
    goals = Goal.objects.filter(student=student)
    if not goals.exists():
        recommendations.append({
            'title': 'Set Academic Goals',
            'description': 'You currently have no goals set. Setting goals can improve your performance.',
            'source': 'System',
        })

    for goal in goals:
        if goal.progress < 50:
            recommendations.append({
                'title': f'Focus on "{goal.title}"',
                'description': f'Your progress on this goal is {goal.progress}%. Consider spending more time on it.',
                'source': 'System',
            })

    # Optionally save recommendations in DB
    recommendation_objs = []
    for rec in recommendations:
        obj, created = Recommendation.objects.get_or_create(
            student=student,
            title=rec['title'],
            defaults={
                'description': rec['description'],
                'source': rec['source'],
                'is_active': True,
            }
        )
        recommendation_objs.append(obj)

    return recommendation_objs


def generate_recommendations_for_all_students():
    """
    Generate recommendations for all students in the system.
    """
    from apps.accounts.models import Student
    all_students = Student.objects.all()
    all_recommendations = []

    for student in all_students:
        student_recs = generate_recommendations_for_student(student)
        all_recommendations.extend(student_recs)

    return all_recommendations
