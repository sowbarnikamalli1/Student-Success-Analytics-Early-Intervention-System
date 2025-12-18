# uploads/serializers.py

from rest_framework import serializers
from .models import Upload

class UploadSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Upload
        fields = ['id', 'uploaded_by', 'file', 'description', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_by', 'uploaded_at']

    def create(self, validated_data):
        # Automatically set the uploading user
        user = self.context['request'].user
        validated_data['uploaded_by'] = user
        return super().create(validated_data)
