from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class StudentAnalytics(models.Model):
    """
    Stores calculated analytics & KPIs per student
    """

    RISK_LEVEL_CHOICES = [
        ("LOW", "Low Risk"),
        ("MEDIUM", "Medium Risk"),
        ("HIGH", "High Risk"),
    ]

    student = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="analytics"
    )

    attendance_percentage = models.FloatField(default=0.0)
    average_marks = models.FloatField(default=0.0)
    assignment_completion_rate = models.FloatField(default=0.0)

    risk_score = models.FloatField(
        help_text="ML or rule-based risk score (0–100)",
        default=0.0
    )

    risk_level = models.CharField(
        max_length=10,
        choices=RISK_LEVEL_CHOICES,
        default="LOW"
    )

    predicted_grade = models.CharField(
        max_length=2,
        blank=True,
        null=True,
        help_text="Predicted final grade (A, B, C, etc.)"
    )

    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Analytics for {self.student}"

    class Meta:
        verbose_name = "Student Analytics"
        verbose_name_plural = "Student Analytics"
