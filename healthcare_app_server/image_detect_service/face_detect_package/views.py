import base64

from django.http import JsonResponse, HttpResponse, HttpRequest
from rest_framework.decorators import api_view
from face_detect_package.models import Response
from face_detect_package.serializers import ResponseSerializer
import json
import os

@api_view(['POST'])
def send_image(request: HttpRequest) -> JsonResponse:

    image = request.FILES["file"]


    response = Response(200, "Successfully", None)
    serializer = ResponseSerializer(response)
    return JsonResponse(serializer.data, safe = False)

