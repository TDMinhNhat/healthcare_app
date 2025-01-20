import asyncio
from py_eureka_client.eureka_client import EurekaClient

def register_service():
    eureka_client = EurekaClient(eureka_server="http://localhost:8761/eureka/",
                                 app_name="face_detect_service",
                                 instance_port=8000)
    asyncio.run(eureka_client.start())
    return eureka_client