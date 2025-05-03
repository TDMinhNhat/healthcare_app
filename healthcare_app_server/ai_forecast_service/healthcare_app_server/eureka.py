import py_eureka_client.eureka_client as eureka_client

eureka_client.init(eureka_server="http://server:8761",
                   app_name="ai_forecast_service",
                   instance_port=13000)