from rest_framework import serializers
from .models import StudentPrediction


class StudentPredictionSerializer(serializers.ModelSerializer):
    """
    Serializer for StudentPrediction model
    """

    student_name = serializers.CharField(
        source="student.username",
        read_only=True
    )

    class Meta:
        model = StudentPrediction
        fields = [
            "id",
            "student",
            "student_name",
            "attendance_percentage",
            "average_marks",
            "assignment_completion_rate",
            "predicted_risk_score",
            "predicted_risk_level",
            "predicted_grade",
            "is_what_if",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "student_name",
            "predicted_risk_score",
            "predicted_risk_level",
            "predicted_grade",
            "created_at",
        ]
class WhatIfScenarioSerializer(serializers.Serializer):
    """
    Serializer for What-If Scenario inputs
    """
    attendance_percentage = serializers.FloatField()
    average_marks = serializers.FloatField()
    assignment_completion_rate = serializers.FloatField()
    