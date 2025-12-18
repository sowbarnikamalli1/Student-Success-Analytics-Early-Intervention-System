
# Register your models here.
from django.contrib import admin
from .models import StudentAnalytics


@admin.register(StudentAnalytics)
class StudentAnalyticsAdmin(admin.ModelAdmin):
    """
    Admin configuration for Student Analytics
    """

    list_display = (
        "student",
        "attendance_percentage",
        "average_marks",
        "assignment_completion_rate",
        "risk_score",
        "risk_level",
        "predicted_grade",
        "last_updated",
    )

    list_filter = (
        "risk_level",
        "predicted_grade",
        "last_updated",
    )

    search_fields = (
        "student__username",
        "student__email",
    )

    readonly_fields = (
        "risk_score",
        "risk_level",
        "predicted_grade",
        "last_updated",
    )

    ordering = ("-last_updated",)

    fieldsets = (
        ("Student Information", {
            "fields": ("student",)
        }),
        ("Performance Metrics", {
            "fields": (
                "attendance_percentage",
                "average_marks",
                "assignment_completion_rate",
            )
        }),
        ("Risk & Prediction (Auto-calculated)", {
            "fields": (
                "risk_score",
                "risk_level",
                "predicted_grade",
            )
        }),
        ("System Info", {
            "fields": ("last_updated",)
        }),
    )
