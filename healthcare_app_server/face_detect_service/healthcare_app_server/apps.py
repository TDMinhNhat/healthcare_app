from django.apps import AppConfig
from .eureka import register_service

class HealthcareAppServerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'healthcare_app_server'

    def ready(self):
        register_service()