from rest_framework import serializers
from .models import Recommendation
from apps.accounts.serializers import StudentSerializer  # Optional, if you want nested student info

class RecommendationSerializer(serializers.ModelSerializer):
    # Optional: include nested student info
    student = serializers.PrimaryKeyRelatedField(queryset=Recommendation._meta.get_field('student').related_model.objects.all())
    # If you want full student details instead of just ID, you can use:
    # student = StudentSerializer(read_only=True)

    class Meta:
        model = Recommendation
        fields = [
            'id',
            'student',
            'title',
            'description',
            'source',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
