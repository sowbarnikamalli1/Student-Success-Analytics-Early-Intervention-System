"""
preprocessing.py

Handles feature preparation for ML models.
This module is independent of Django ORM to allow reuse
in training scripts, batch jobs, and APIs.
"""

import numpy as np


# -----------------------------
# FEATURE NORMALIZATION
# -----------------------------

def normalize_features(attendance, marks, assignment_rate):
    """
    Normalize input features to 0–1 range

    Input:
    - attendance: 0–100
    - marks: 0–100
    - assignment_rate: 0–100

    Output:
    - numpy array of normalized features
    """

    attendance_norm = attendance / 100
    marks_norm = marks / 100
    assignment_norm = assignment_rate / 100

    return np.array([
        attendance_norm,
        marks_norm,
        assignment_norm
    ])


# -----------------------------
# FEATURE VECTOR BUILDER
# -----------------------------

def build_feature_vector(data: dict):
    """
    Converts raw input dictionary into ML-ready feature vector

    Expected keys:
    - attendance_percentage
    - average_marks
    - assignment_completion_rate
    """

    return normalize_features(
        data.get("attendance_percentage", 0),
        data.get("average_marks", 0),
        data.get("assignment_completion_rate", 0)
    )


# -----------------------------
# INPUT VALIDATION
# -----------------------------

def validate_input(data: dict):
    """
    Validates and cleans incoming prediction data
    """

    required_fields = [
        "attendance_percentage",
        "average_marks",
        "assignment_completion_rate"
    ]

    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")

        value = data[field]
        if not (0 <= value <= 100):
            raise ValueError(
                f"{field} must be between 0 and 100"
            )

    return True
# -----------------------------
# END OF FILE
# -----------------------------
