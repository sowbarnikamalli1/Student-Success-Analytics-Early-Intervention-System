from django.contrib import admin
from .models import StudentPrediction


@admin.register(StudentPrediction)
class StudentPredictionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "attendance_percentage",
        "average_marks",
        "assignment_completion_rate",
        "predicted_risk_score",
        "predicted_risk_level",
        "predicted_grade",
        "is_what_if",
        "created_at",
    )
    list_filter = ("predicted_risk_level", "is_what_if")
    search_fields = ("student__username",)
    readonly_fields = (
        "predicted_risk_score",
        "predicted_risk_level",
        "predicted_grade",
        "created_at",
    )
    ordering = ("-created_at",)     
    fieldsets = (
        ("Student Information", {
            "fields": ("student",)
        }),
        ("Input Metrics", {
            "fields": (
                "attendance_percentage",
                "average_marks",
                "assignment_completion_rate",
            )
        }),
        ("Predictions (Auto-calculated)", {
            "fields": (
                "predicted_risk_score",
                "predicted_risk_level",
                "predicted_grade",
                "is_what_if",
            )
        }),
    )
# -----------------------------
# END OF FILE                                   
# -----------------------------