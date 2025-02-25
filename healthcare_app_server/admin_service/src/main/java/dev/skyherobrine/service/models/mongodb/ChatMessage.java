package dev.skyherobrine.service.models.mongodb;

import dev.skyherobrine.service.models.mariadb.Doctor;
import dev.skyherobrine.service.models.mariadb.Patient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "chat_messages")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ChatMessage {

    @MongoId
    private Long id;
    private Patient patient;
    private Doctor doctor;
    private String message;
    @Field(name = "is_recall")
    private Boolean isRecall;
    private ChatMessage response;
    @Field(name = "created_at", targetType = FieldType.DATE_TIME)
    private LocalDateTime createdAt;
    @Field(name = "updated-at", targetType = FieldType.DATE_TIME)
    private LocalDateTime updatedAt;
}
