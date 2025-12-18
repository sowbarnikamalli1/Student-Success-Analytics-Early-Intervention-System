"""
analytics/services.py

This module contains all KPI calculations and risk evaluation logic.
Keeping this logic here follows clean architecture principles.
"""

from typing import Dict


# -------------------------------
# KPI CALCULATION FUNCTIONS
# -------------------------------

def calculate_attendance_kpi(attended_classes: int, total_classes: int) -> float:
    """
    Returns attendance percentage
    """
    if total_classes == 0:
        return 0.0
    return round((attended_classes / total_classes) * 100, 2)


def calculate_average_marks(marks_list: list) -> float:
    """
    Returns average marks from a list of scores
    """
    if not marks_list:
        return 0.0
    return round(sum(marks_list) / len(marks_list), 2)


def calculate_assignment_completion(completed: int, total: int) -> float:
    """
    Returns assignment completion percentage
    """
    if total == 0:
        return 0.0
    return round((completed / total) * 100, 2)


# -------------------------------
# RISK SCORE CALCULATION
# -------------------------------

def calculate_risk_score(
    attendance_percentage: float,
    average_marks: float,
    assignment_completion_rate: float
) -> float:
    """
    Weighted risk score calculation (0–100)

    Weights:
    - Attendance: 30%
    - Marks: 40%
    - Assignments: 30%
    """

    attendance_weight = 0.3
    marks_weight = 0.4
    assignment_weight = 0.3

    risk_score = (
        (100 - attendance_percentage) * attendance_weight +
        (100 - average_marks) * marks_weight +
        (100 - assignment_completion_rate) * assignment_weight
    )

    return round(max(0, min(risk_score, 100)), 2)


# -------------------------------
# RISK LEVEL CLASSIFICATION
# -------------------------------

def determine_risk_level(risk_score: float) -> str:
    """
    Classifies student risk level
    """
    if risk_score >= 70:
        return "HIGH"
    elif risk_score >= 40:
        return "MEDIUM"
    return "LOW"


# -------------------------------
# PREDICTED GRADE (RULE-BASED)
# -------------------------------

def predict_grade(average_marks: float) -> str:
    """
    Rule-based grade prediction
    (Can be replaced with ML model later)
    """
    if average_marks >= 85:
        return "A"
    elif average_marks >= 70:
        return "B"
    elif average_marks >= 55:
        return "C"
    elif average_marks >= 40:
        return "D"
    return "F"


# -------------------------------
# MASTER ANALYTICS GENERATOR
# -------------------------------

def generate_student_analytics(data: Dict) -> Dict:
    """
    Central analytics generator used by views / Celery tasks

    Expected data keys:
    - attended_classes
    - total_classes
    - marks_list
    - assignments_completed
    - total_assignments
    """

    attendance = calculate_attendance_kpi(
        data.get("attended_classes", 0),
        data.get("total_classes", 0)
    )

    average_marks = calculate_average_marks(
        data.get("marks_list", [])
    )

    assignment_rate = calculate_assignment_completion(
        data.get("assignments_completed", 0),
        data.get("total_assignments", 0)
    )

    risk_score = calculate_risk_score(
        attendance,
        average_marks,
        assignment_rate
    )

    risk_level = determine_risk_level(risk_score)
    predicted_grade = predict_grade(average_marks)

    return {
        "attendance_percentage": attendance,
        "average_marks": average_marks,
        "assignment_completion_rate": assignment_rate,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "predicted_grade": predicted_grade,
    }
