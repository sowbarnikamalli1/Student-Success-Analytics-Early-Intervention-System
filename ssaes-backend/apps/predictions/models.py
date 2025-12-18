from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class StudentPrediction(models.Model):
    """
    Stores ML prediction history and what-if analysis results
    """

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="predictions"
    )

    # Input features used for prediction
    attendance_percentage = models.FloatField()
    average_marks = models.FloatField()
    assignment_completion_rate = models.FloatField()

    # ML outputs
    predicted_risk_score = models.FloatField(
        help_text="Predicted risk score (0–100)"
    )

    predicted_risk_level = models.CharField(
        max_length=10,
        choices=[
            ("LOW", "Low Risk"),
            ("MEDIUM", "Medium Risk"),
            ("HIGH", "High Risk"),
        ]
    )

    predicted_grade = models.CharField(
        max_length=2,
        help_text="Predicted final grade (A, B, C, etc.)"
    )

    # What-if analysis flag
    is_what_if = models.BooleanField(
        default=False,
        help_text="True if generated from what-if simulation"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        tag = "What-If" if self.is_what_if else "Actual"
        return f"{tag} Prediction – {self.student}"
