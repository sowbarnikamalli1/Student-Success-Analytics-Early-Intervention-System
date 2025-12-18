from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .ml.predictor import predict_student_outcome
from .models import StudentPrediction
from .serializers import StudentPredictionSerializer


class RegisterView(APIView):
    """
    Dummy placeholder view to fix earlier import error.
    This can be replaced with real registration logic.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"msg": "RegisterView placeholder"})


class ProfileView(APIView):
    """
    Dummy placeholder view to fix earlier import error.
    This can be replaced with real profile logic.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"msg": "ProfileView placeholder"})


class StudentPredictionAPIView(APIView):
    """
    Accepts student metrics and returns predicted risk & grade.
    Also saves prediction history.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data["student"] = request.user.id  # link prediction to logged-in student

        try:
            prediction_result = predict_student_outcome(data)
        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save prediction
        prediction_instance = StudentPrediction.objects.create(
            student=request.user,
            attendance_percentage=data.get("attendance_percentage", 0),
            average_marks=data.get("average_marks", 0),
            assignment_completion_rate=data.get("assignment_completion_rate", 0),
            predicted_risk_score=prediction_result["predicted_risk_score"],
            predicted_risk_level=prediction_result["predicted_risk_level"],
            predicted_grade=prediction_result["predicted_grade"],
            is_what_if=data.get("is_what_if", False)
        )

        serializer = StudentPredictionSerializer(prediction_instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
