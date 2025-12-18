from rest_framework import viewsets, permissions
from .models import Student
from .serializers import StudentSerializer, StudentCreateSerializer
from apps.accounts.permissions import IsAdmin, IsFaculty

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return StudentCreateSerializer
        return StudentSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdmin | IsFaculty]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [p() for p in permission_classes]
