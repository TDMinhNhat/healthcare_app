FROM openjdk:21-jdk-slim

WORKDIR /app

COPY appointment_service.jar /app/appointment_service.jar

ENTRYPOINT ["java", "-jar", "appointment_service.jar"]