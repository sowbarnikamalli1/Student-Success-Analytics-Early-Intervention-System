from django_filters import rest_framework as filters
from .models import Student

class StudentFilter(filters.FilterSet):
    min_marks = filters.NumberFilter(field_name="marks", lookup_expr='gte')
    max_marks = filters.NumberFilter(field_name="marks", lookup_expr='lte')
    min_attendance = filters.NumberFilter(field_name="attendance", lookup_expr='gte')
    max_attendance = filters.NumberFilter(field_name="attendance", lookup_expr='lte')
    
    class Meta:
        model = Student
        fields = ['department', 'year', 'min_marks', 'max_marks', 'min_attendance', 'max_attendance']
