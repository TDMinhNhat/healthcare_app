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

        if result == 0:
            response = Response(400, "Can't detect the face", None)
            serializer = ResponseSerializer(response)
            return JsonResponse(serializer.data, safe = False)
        elif result == -1:
            response = Response(400, "Must be 1 face in image", None)
            serializer = ResponseSerializer(response)
            return JsonResponse(serializer.data, safe = False)
        elif result == 2:
            response = Response(200, "New User", None)
            serializer = ResponseSerializer(response)
            return JsonResponse(serializer.data, safe = False)
        else:
            response = Response(200, "This user has existed in database", None)
            serializer = ResponseSerializer(response)
            return JsonResponse(serializer.data, safe = False)

    except RuntimeError as e:
        response = Response(500, "Can't decoded the image", None)
        serializer = ResponseSerializer(response)
        return JsonResponse(serializer.data, safe = False)



