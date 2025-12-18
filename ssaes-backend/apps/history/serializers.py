from rest_framework import serializers
from .models import History

class HistorySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    student = serializers.StringRelatedField(read_only=True)
    prediction = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = History
        fields = ['id', 'user', 'student', 'prediction', 'action', 'description', 'timestamp']
        read_only_fields = ['id', 'timestamp']
