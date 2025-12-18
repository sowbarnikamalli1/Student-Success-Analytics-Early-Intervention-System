from rest_framework import viewsets, permissions
from .models import History
from .serializers import HistorySerializer

class HistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only endpoint for viewing audit logs or prediction history.
    """
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Admins and faculty can see all history
        if user.role in ['ADMIN', 'FACULTY']:
            return super().get_queryset()
        # Students can see only their own history
        return History.objects.filter(user=user)
