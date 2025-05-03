FROM openjdk:21-jdk-slim

WORKDIR /app

COPY admin_service.jar /app/admin_service.jar

ENTRYPOINT ["java", "-jar", "admin_service.jar"]