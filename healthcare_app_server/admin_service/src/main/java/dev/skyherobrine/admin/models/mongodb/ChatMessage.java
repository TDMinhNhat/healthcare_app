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

    @Field(name = "room_call_id")
    private RoomCall roomCall;

    private String message;

    @Field(name = "is_recall")
    private Boolean isRecall;

    @Field(name = "reply_id")
    private ChatMessage reply;

    @Field(name = "created_at", targetType = FieldType.DATE_TIME)
    private LocalDateTime createdAt;

    @Field(name = "updated-at", targetType = FieldType.DATE_TIME)
    private LocalDateTime updatedAt;

    public ChatMessage(Long id, RoomCall roomCall, String message) {
        this.id = id;
        this.roomCall = roomCall;
        this.message = message;
        this.reply = null;
        this.isRecall = false;
        this.createdAt = updatedAt = LocalDateTime.now();
    }

    public ChatMessage(Long id, RoomCall roomCall, ChatMessage reply, String message) {
        this.id = id;
        this.roomCall = roomCall;
        this.reply = reply;
        this.message = message;
        this.isRecall = false;
        this.createdAt = updatedAt = LocalDateTime.now();
    }
}
