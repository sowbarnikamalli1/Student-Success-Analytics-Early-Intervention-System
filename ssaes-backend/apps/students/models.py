from django.db import models
from django.conf import settings

class Student(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    enrollment_number = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=50)
    year = models.IntegerField()
    marks = models.FloatField(default=0.0)
    attendance = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.enrollment_number}"
