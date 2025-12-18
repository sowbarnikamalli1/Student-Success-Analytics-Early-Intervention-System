# uploads/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Upload
from .serializers import UploadSerializer
from apps.accounts.permissions import IsAdmin, IsFaculty, IsStudent

class UploadViewSet(viewsets.ModelViewSet):
    """
    ViewSet to handle file uploads.
    Supports multipart/form-data and form submissions.
    """
    queryset = Upload.objects.all()
    serializer_class = UploadSerializer
    parser_classes = [MultiPartParser, FormParser]  # Handles file + form fields

    def get_permissions(self):
        """
        Set permissions based on user role and action.
        Admin and Faculty can create/update/delete.
        Students can only view.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdmin | IsFaculty]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [p() for p in permission_classes]

    def get_queryset(self):
        """
        Filter queryset based on user role.
        Students see only their own uploads.
        """
        user = self.request.user
        if user.role == 'STUDENT':
            return Upload.objects.filter(student__user=user)
        return super().get_queryset()

    def create(self, request, *args, **kwargs):
        """
        Handle file upload.
        Can be extended to process files after saving.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
