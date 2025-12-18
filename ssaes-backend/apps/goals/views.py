from rest_framework import viewsets, permissions
from .models import Goal
from .serializers import GoalSerializer
from apps.accounts.permissions import IsAdmin, IsFaculty

class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    def get_permissions(self):
        """
        Admin/Faculty can create/update/delete goals.
        Students can only view their own goals.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdmin | IsFaculty]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [p() for p in permission_classes]

    def get_queryset(self):
        """
        Students can only see their own goals.
        Admin/Faculty can see all goals.
        """
        user = self.request.user
        if user.role == 'STUDENT':
            return Goal.objects.filter(student__user=user)
        return super().get_queryset()
