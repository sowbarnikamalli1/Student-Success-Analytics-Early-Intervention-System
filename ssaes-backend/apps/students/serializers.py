from rest_framework import serializers
from .models import Student
from apps.accounts.serializers import UserSerializer

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Student
        fields = '__all__'


class StudentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('user', 'enrollment_number', 'department', 'year', 'marks', 'attendance')
