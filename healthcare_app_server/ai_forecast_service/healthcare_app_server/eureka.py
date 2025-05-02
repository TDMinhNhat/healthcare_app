import py_eureka_client.eureka_client as eureka_client

eureka_client.init(eureka_server="http://localhost:8761",
                   app_name="image_detect_service",
                   instance_port=13000)