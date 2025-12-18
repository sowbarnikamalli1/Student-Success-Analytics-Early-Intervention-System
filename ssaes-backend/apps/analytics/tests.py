

# Create your tests here.
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from .models import StudentAnalytics
from .services import (
    calculate_attendance_kpi,
    calculate_average_marks,
    calculate_assignment_completion,
    calculate_risk_score,
    determine_risk_level,
)

User = get_user_model()


# -----------------------------
# SERVICE FUNCTION TESTS
# -----------------------------

class AnalyticsServiceTests(TestCase):

    def test_attendance_kpi(self):
        result = calculate_attendance_kpi(45, 50)
        self.assertEqual(result, 90.0)

    def test_average_marks(self):
        result = calculate_average_marks([70, 80, 90])
        self.assertEqual(result, 80.0)

    def test_assignment_completion(self):
        result = calculate_assignment_completion(8, 10)
        self.assertEqual(result, 80.0)

    def test_risk_score_and_level(self):
        risk_score = calculate_risk_score(
            attendance_percentage=50,
            average_marks=45,
            assignment_completion_rate=40
        )
        self.assertTrue(risk_score > 0)
        self.assertEqual(determine_risk_level(risk_score), "HIGH")


# -----------------------------
# MODEL TESTS
# -----------------------------

class StudentAnalyticsModelTests(TestCase):

    def setUp(self):
        self.student = User.objects.create_user(
            username="test_student",
            password="testpass123"
        )

        self.analytics = StudentAnalytics.objects.create(
            student=self.student,
            attendance_percentage=85,
            average_marks=72,
            assignment_completion_rate=90,
            risk_score=30,
            risk_level="LOW",
            predicted_grade="B"
        )

    def test_student_analytics_creation(self):
        self.assertEqual(self.analytics.student.username, "test_student")
        self.assertEqual(self.analytics.risk_level, "LOW")

    def test_string_representation(self):
        self.assertIn("Analytics for", str(self.analytics))


# -----------------------------
# API TESTS
# -----------------------------

class DashboardAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="faculty",
            password="faculty123"
        )
        self.client.force_authenticate(user=self.user)

        student1 = User.objects.create_user(username="s1", password="123")
        student2 = User.objects.create_user(username="s2", password="123")

        StudentAnalytics.objects.create(
            student=student1,
            attendance_percentage=60,
            average_marks=50,
            assignment_completion_rate=55,
            risk_score=65,
            risk_level="MEDIUM"
        )

        StudentAnalytics.objects.create(
            student=student2,
            attendance_percentage=40,
            average_marks=35,
            assignment_completion_rate=30,
            risk_score=80,
            risk_level="HIGH"
        )

    def test_dashboard_api(self):
        url = reverse("analytics-dashboard")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("total_students", response.data)
        self.assertIn("at_risk_students", response.data)
        self.assertEqual(response.data["at_risk_students"], 1)
