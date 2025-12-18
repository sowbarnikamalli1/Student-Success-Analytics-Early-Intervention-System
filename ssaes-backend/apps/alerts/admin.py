from django.contrib import admin

# Register your models here.

from .models import Alert

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('student', 'risk_level', 'message', 'created_at', 'read')
    list_filter = ('risk_level', 'read')
    search_fields = ('student__user__username', 'message')
