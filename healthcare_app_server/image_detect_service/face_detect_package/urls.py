from django.urls import path, include
from face_detect_package import views

urlpatterns = [
    path('auth', views.authenticate_face),
    path('register', views.register_face)
]