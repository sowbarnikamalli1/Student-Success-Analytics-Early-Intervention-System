# alerts/views.py

from rest_framework import viewsets, permissions
from .models import Alert
from .serializers import AlertSerializer
from apps.accounts.permissions import IsAdmin, IsFaculty, IsStudent

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all().order_by('-created_at')
    serializer_class = AlertSerializer

    def get_permissions(self):
        """
        Define permissions based on action:
        - Admins and Faculty can create, update, delete.
        - Students can only view their alerts.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdmin | IsFaculty]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [p() for p in permission_classes]

    def get_queryset(self):
        """
        Students see only their own alerts.
        Admins and Faculty see all alerts.
        """
        user = self.request.user
        if user.role == 'STUDENT':
            return Alert.objects.filter(student__user=user)
        elif user.role == 'FACULTY':
            return Alert.objects.filter(faculty__user=user)
        return super().get_queryset()
