from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'enrollment_number', 'department', 'year', 'marks', 'attendance')
    search_fields = ('user__username', 'enrollment_number', 'department')
    list_filter = ('department', 'year')
