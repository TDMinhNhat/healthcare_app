FROM openjdk:21-jdk-slim

WORKDIR /app

COPY authenticate_service.jar /app/authenticate_service.jar

ENTRYPOINT ["java", "-jar", "authenticate_service.jar"]