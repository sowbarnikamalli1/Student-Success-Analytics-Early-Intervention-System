# alerts/models.py

from django.db import models
from apps.accounts.models import Student, Faculty

ALERT_LEVEL_CHOICES = [
    ('LOW', 'Low'),
    ('MEDIUM', 'Medium'),
    ('HIGH', 'High'),
]

class Alert(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='alerts')
    faculty = models.ForeignKey(Faculty, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_alerts')
    title = models.CharField(max_length=255)
    description = models.TextField()
    level = models.CharField(max_length=10, choices=ALERT_LEVEL_CHOICES, default='LOW')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.student.user.username} ({self.level})"
