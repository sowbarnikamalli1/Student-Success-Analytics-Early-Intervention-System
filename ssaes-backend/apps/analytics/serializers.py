from rest_framework import serializers
from .models import StudentAnalytics


class StudentAnalyticsSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source="student.username",
        read_only=True
    )

    class Meta:
        model = StudentAnalytics
        fields = [
            "id",
            "student",
            "student_name",
            "attendance_percentage",
            "average_marks",
            "assignment_completion_rate",
            "risk_score",
            "risk_level",
            "predicted_grade",
            "last_updated",
        ]
        read_only_fields = [
            "risk_score",
            "risk_level",
            "predicted_grade",
            "last_updated",
        ]


class DashboardSerializer(serializers.Serializer):
    """
    Serializer for Faculty/Admin Dashboard KPIs
    """
    total_students = serializers.IntegerField()
    at_risk_students = serializers.IntegerField()
    average_marks = serializers.FloatField()
    average_attendance = serializers.FloatField()
