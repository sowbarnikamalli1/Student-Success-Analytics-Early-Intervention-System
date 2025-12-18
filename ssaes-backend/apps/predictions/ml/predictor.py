"""
predictor.py

Handles ML inference logic.
This module can use a trained ML model or fall back
to a rule-based predictor for demo and testing.
"""

import os
import joblib
import numpy as np

from .preprocessing import (
    validate_input,
    build_feature_vector
)

# -----------------------------
# MODEL LOADING
# -----------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "student_risk_model.pkl")


def load_model():
    """
    Loads trained ML model if available
    """
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)
    return None


MODEL = load_model()


# -----------------------------
# FALLBACK RULE-BASED LOGIC
# -----------------------------

def rule_based_prediction(features: np.ndarray) -> dict:
    """
    Simple fallback predictor (used if ML model not found)
    """

    attendance, marks, assignment = features * 100

    risk_score = (
        (100 - attendance) * 0.3 +
        (100 - marks) * 0.4 +
        (100 - assignment) * 0.3
    )

    risk_score = round(min(max(risk_score, 0), 100), 2)

    if risk_score >= 70:
        risk_level = "HIGH"
    elif risk_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    if marks >= 85:
        grade = "A"
    elif marks >= 70:
        grade = "B"
    elif marks >= 55:
        grade = "C"
    elif marks >= 40:
        grade = "D"
    else:
        grade = "F"

    return {
        "predicted_risk_score": risk_score,
        "predicted_risk_level": risk_level,
        "predicted_grade": grade
    }


# -----------------------------
# MAIN PREDICTION FUNCTION
# -----------------------------

def predict_student_outcome(data: dict) -> dict:
    """
    Main entry point for predictions
    """

    validate_input(data)

    features = build_feature_vector(data)

    if MODEL:
        prediction = MODEL.predict([features])[0]

        return {
            "predicted_risk_score": round(float(prediction[0]), 2),
            "predicted_risk_level": prediction[1],
            "predicted_grade": prediction[2]
        }

    # fallback logic
    return rule_based_prediction(features)
