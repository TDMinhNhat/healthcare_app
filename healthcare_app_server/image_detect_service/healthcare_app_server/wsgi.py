"""
WSGI config for healthcare_app_server project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
import healthcare_app_server.eureka
from django.core.wsgi import get_wsgi_application

from healthcare_app_server.kafka_consumer import KafkaConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthcare_app_server.settings')

application = get_wsgi_application()

KafkaConsumer().start()