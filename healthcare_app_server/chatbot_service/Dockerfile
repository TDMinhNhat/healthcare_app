FROM openjdk:21-jdk-slim

WORKDIR /app

COPY chatbot_service.jar /app/chatbot_service.jar

ENTRYPOINT ["java", "-jar", "chatbot_service.jar"]