from rest_framework import serializers
from face_detect_package.models import Response

class ResponseSerializer(serializers.Serializer):

    code = serializers.IntegerField()
    message = serializers.CharField(max_length = 300)
    data = serializers.JSONField()

    class Meta:
        name = Response
        fields = '__all__'