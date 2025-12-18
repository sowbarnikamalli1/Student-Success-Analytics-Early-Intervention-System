# recommendations/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Recommendation
from .serializers import RecommendationSerializer
from .engine import generate_recommendations_for_student, generate_recommendations_for_all_students
from apps.accounts.permissions import IsAdmin, IsFaculty

class RecommendationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Recommendations.
    Students can view their own recommendations.
    Faculty/Admin can view and generate recommendations for all students.
    """
    queryset = Recommendation.objects.all()
    serializer_class = RecommendationSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'generate_all']:
            permission_classes = [IsAdmin | IsFaculty]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [p() for p in permission_classes]

    def get_queryset(self):
        user = self.request.user
        # Students only see their own recommendations
        if hasattr(user, 'student'):
            return Recommendation.objects.filter(student=user.student)
        return super().get_queryset()

    @action(detail=False, methods=['post'], url_path='generate-all')
    def generate_all(self, request):
        """
        Generate recommendations for all students (faculty/admin only).
        """
        recommendations = generate_recommendations_for_all_students()
        serializer = self.get_serializer(recommendations, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='generate-my')
    def generate_my(self, request):
        """
        Generate recommendations for the logged-in student.
        """
        user = request.user
        if not hasattr(user, 'student'):
            return Response({'detail': 'You are not a student.'}, status=status.HTTP_403_FORBIDDEN)
        
        recommendations = generate_recommendations_for_student(user.student)
        serializer = self.get_serializer(recommendations, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
