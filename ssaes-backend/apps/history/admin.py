from django.contrib import admin
from .models import History

@admin.register(History)
class HistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'student', 'prediction', 'action', 'timestamp')
    list_filter = ('action', 'timestamp', 'user')
    search_fields = ('user__username', 'student__user__username', 'description')
    ordering = ('-timestamp',)
