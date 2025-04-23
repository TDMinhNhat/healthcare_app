"""
ASGI config for healthcare_app_server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import socketio

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthcare_app_server.settings')

import django
django.setup()

from django.core.asgi import get_asgi_application
from healthcare_app_server.kafka_consumer import KafkaConsumer
import face_detect_package.services as face_detect_service
import healthcare_app_server.eureka
import base64

sio = socketio.AsyncServer(async_mode = 'asgi', cors_allowed_origins = '*', always_connect=False, max_http_buffer_size=100 * 1024 * 1024 * 1024)
django_asgi_application = get_asgi_application()

application = socketio.ASGIApp(sio, django_asgi_application, socketio_path="/image_detect/socket")
KafkaConsumer().start()

@sio.event
async def connect(sid, environ):
    print("Client connected: ", sid)
    pass

@sio.event
async def disconnect(sid):
    print("Client disconnected: ", sid)
    pass

@sio.on("emergency_detect_request")
async def emergency_detect(sid, data):
    image_bytes = base64.b64decode(data["image"])
    face_detect = face_detect_service.FaceDetectService(image_bytes)
    await sio.emit("emergency_detect_response", await face_detect.detect_face())
    pass

@sio.on("send_data_emergency")
async def send_data_emergency(sid, data):
    await sio.emit("receive_patient_in_emergency", data)
    pass

@sio.on("request_patient_in_emergency")
async def get_patient_in_emergency(sid, data):
    await sio.emit("patient_in_emergency_response")
    pass
