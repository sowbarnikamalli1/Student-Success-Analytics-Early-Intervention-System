# alerts/serializers.py

from rest_framework import serializers
from .models import Alert

class AlertSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.username', read_only=True)
    faculty_name = serializers.CharField(source='faculty.user.username', read_only=True)

    class Meta:
        model = Alert
        fields = [
            'id',
            'student',
            'student_name',
            'faculty',
            'faculty_name',
            'title',
            'description',
            'level',
            'resolved',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'student_name', 'faculty_name']
