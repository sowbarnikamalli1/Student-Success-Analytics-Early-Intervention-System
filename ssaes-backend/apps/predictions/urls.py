from django.urls import path
from .views import RegisterView, ProfileView, StudentPredictionAPIView

urlpatterns = [
    # Temporary placeholders
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", ProfileView.as_view(), name="profile"),

    # Main ML prediction API
    path("predict/", StudentPredictionAPIView.as_view(), name="student-predict"),
]
