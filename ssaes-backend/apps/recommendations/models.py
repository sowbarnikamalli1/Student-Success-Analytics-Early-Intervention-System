from django.db import models
from apps.accounts.models import Student

class Recommendation(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='recommendations')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    source = models.CharField(max_length=100, blank=True, null=True)  # e.g., 'ML Model', 'Faculty'
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} for {self.student.user.username}"
