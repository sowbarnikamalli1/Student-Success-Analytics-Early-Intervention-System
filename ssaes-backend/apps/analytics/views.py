from django.db.models import Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import StudentAnalytics
from .serializers import DashboardSerializer


class DashboardAPIView(APIView):
    """
    Faculty/Admin Dashboard KPI API
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_students = StudentAnalytics.objects.count()

        at_risk_students = StudentAnalytics.objects.filter(
            risk_level="HIGH"
        ).count()

        average_marks = StudentAnalytics.objects.aggregate(
            avg=Avg("average_marks")
        )["avg"] or 0

        average_attendance = StudentAnalytics.objects.aggregate(
            avg=Avg("attendance_percentage")
        )["avg"] or 0

        data = {
            "total_students": total_students,
            "at_risk_students": at_risk_students,
            "average_marks": average_marks,
            "average_attendance": average_attendance,
        }

        serializer = DashboardSerializer(data)
        return Response(serializer.data)
