from django.db import models
from django.conf import settings
from apps.students.models import Student  # Adjust if you track per student
from apps.predictions.models import Prediction  # Optional: if linked to ML predictions

class History(models.Model):
    ACTION_CHOICES = [
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('PREDICT', 'Predict'),
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('OTHER', 'Other'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='history_entries'
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='history_entries'
    )
    prediction = models.ForeignKey(
        Prediction,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='history_entries'
    )
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = 'History'

    def __str__(self):
        return f"{self.user.username} - {self.action} at {self.timestamp}"
