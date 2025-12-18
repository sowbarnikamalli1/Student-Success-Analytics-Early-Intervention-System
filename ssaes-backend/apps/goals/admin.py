from django.contrib import admin
from .models import Goal

@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ('student', 'title', 'achieved', 'deadline')
    list_filter = ('achieved',)
    search_fields = ('student__user__username', 'title')
