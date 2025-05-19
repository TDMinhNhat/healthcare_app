FROM openjdk:21-jdk-slim

WORKDIR /app

COPY healthcare_app_server.jar /app/healthcare_app_server.jar

ENTRYPOINT ["java", "-jar", "healthcare_app_server.jar"]