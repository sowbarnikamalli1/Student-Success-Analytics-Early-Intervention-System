# alerts/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlertViewSet

# Create a router and register the AlertViewSet
router = DefaultRouter()
router.register(r'alerts', AlertViewSet, basename='alert')

urlpatterns = [
    path('', include(router.urls)),
]
