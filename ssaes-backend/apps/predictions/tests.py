from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class PredictionsAPITestCase(TestCase):
    """
    Test ML prediction API endpoints
    """

    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)  # login

        # Common valid data for predictions
        self.valid_data = {
            "attendance_percentage": 80,
            "average_marks": 75,
            "assignment_completion_rate": 90,
            "is_what_if": False
        }

    def test_prediction_endpoint_success(self):
        """
        Ensure /predict/ returns 201 and correct fields
        """
        response = self.client.post("/api/predictions/predict/", self.valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check response contains expected keys
        keys = [
            "id",
            "student",
            "attendance_percentage",
            "average_marks",
            "assignment_completion_rate",
            "predicted_risk_score",
            "predicted_risk_level",
            "predicted_grade",
            "is_what_if",
            "created_at"
        ]
        for key in keys:
            self.assertIn(key, response.data)

    def test_prediction_endpoint_invalid_data(self):
        """
        Should return 400 if required field is missing or out of range
        """
        invalid_data = self.valid_data.copy()
        invalid_data.pop("attendance_percentage")  # remove required field

        response = self.client.post("/api/predictions/predict/", invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
