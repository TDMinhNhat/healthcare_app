FROM openjdk:21-jdk-slim

WORKDIR /app

COPY api_gateway_service.jar /app/api_gateway_service.jar

ENTRYPOINT ["java", "-jar", "api_gateway_service.jar"]