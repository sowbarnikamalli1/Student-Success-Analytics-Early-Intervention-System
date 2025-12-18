# uploads/models.py

from django.db import models
from apps.accounts.models import Student, Faculty

def user_upload_path(instance, filename):
    """
    Upload path: MEDIA_ROOT/uploads/<user_id>/<filename>
    """
    return f"uploads/{instance.uploaded_by.id}/{filename}"

class Upload(models.Model):
    """
    Model to store uploaded files by students or faculty.
    """
    uploaded_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='uploads'
    )
    file = models.FileField(upload_to=user_upload_path)
    description = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file.name} uploaded by {self.uploaded_by.username}"

    class Meta:
        ordering = ['-uploaded_at']
