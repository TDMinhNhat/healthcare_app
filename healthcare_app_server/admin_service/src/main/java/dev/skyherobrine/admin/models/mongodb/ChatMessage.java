package dev.skyherobrine.admin.models.mongodb;

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

    @Field(name = "book_appointment_id")
    private BookAppointment bookAppointment;

    private String message;

    @Field(name = "is_recall")
    private Boolean isRecall;

    @Field(name = "reply_id")
    private ChatMessage reply;

    @Field(name = "created_at", targetType = FieldType.DATE_TIME)
    private LocalDateTime createdAt;

    @Field(name = "updated-at", targetType = FieldType.DATE_TIME)
    private LocalDateTime updatedAt;

    public ChatMessage(Long id, BookAppointment bookAppointment, String message) {
        this.id = id;
        this.bookAppointment = bookAppointment;
        this.message = message;
        this.reply = null;
        this.isRecall = false;
        this.createdAt = updatedAt = LocalDateTime.now();
    }

    public ChatMessage(Long id, BookAppointment bookAppointment, ChatMessage reply, String message) {
        this.id = id;
        this.bookAppointment = bookAppointment;
        this.reply = reply;
        this.message = message;
        this.isRecall = false;
        this.createdAt = updatedAt = LocalDateTime.now();
    }
}
