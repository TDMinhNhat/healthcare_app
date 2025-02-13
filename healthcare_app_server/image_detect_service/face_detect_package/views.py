from django.http import JsonResponse, HttpResponse, HttpRequest
from rest_framework.decorators import api_view
from face_detect_package.models import Response
from face_detect_package.serializers import ResponseSerializer
from face_detect_package.services import *

@api_view(['POST'])
def send_image(request: HttpRequest) -> JsonResponse:
    try:
        get_image = request.FILES["file"]
        image = get_image.read()
        result = FaceDetectService(image).detect_face()

        if result == "No Detect":
            response = Response(400, "Can't detect the face", None)
            serializer = ResponseSerializer(response)
            return JsonResponse(serializer.data, safe = False)
        elif result == "Multiple Face":
            response = Response(400, "Must be 1 face in image", None)
            serializer = ResponseSerializer(response)
            return JsonResponse(serializer.data, safe = False)
        elif result == "Can't detect":
            response = Response(400, "Can't detect who is this", None)
            serializer = ResponseSerializer(response)
            return JsonResponse(serializer.data, safe = False)
        elif isinstance(result, str):
            response = Response(200, "New User", result)
            serializer = ResponseSerializer(response)
            return JsonResponse(serializer.data, safe = False)
        else:
            return JsonResponse(result, safe = False)

    except RuntimeError as e:
        response = Response(500, "Can't decoded the image", None)
        serializer = ResponseSerializer(response)
        return JsonResponse(serializer.data, safe = False)



