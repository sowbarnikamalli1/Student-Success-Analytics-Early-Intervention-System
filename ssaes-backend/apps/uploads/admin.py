# uploads/admin.py

from django.contrib import admin
from .models import Upload

@admin.register(Upload)
class UploadAdmin(admin.ModelAdmin):
    list_display = ('id', 'uploaded_by', 'file', 'uploaded_at')
    list_filter = ('uploaded_at', 'uploaded_by')
    search_fields = ('uploaded_by__username', 'file')
    readonly_fields = ('uploaded_at',)
