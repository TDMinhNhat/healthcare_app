package dev.skyherobrine.service.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "private_chats")
@Getter @Setter @NoArgsConstructor
public class PrivateChat {

    @MongoId @Field(targetType = FieldType.INT64) @NonNull
    private Long id;

    @Field(name = "sender_id", targetType = FieldType.STRING) @NonNull
    private String senderId;

    @Field(name = "receiver_id", targetType = FieldType.STRING) @NonNull
    private String receiverId;

    @Field(targetType = FieldType.STRING) @NonNull
    private String message;

    @Field(name = "is_recall", targetType = FieldType.BOOLEAN) @NonNull
    private Boolean isRecall;

    @Field(name = "is_read", targetType = FieldType.BOOLEAN) @NonNull
    private Boolean isRead;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(name = "created_at", targetType = FieldType.DATE_TIME) @NonNull
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(name = "updated_at", targetType = FieldType.DATE_TIME) @NonNull
    private LocalDateTime updatedAt;
}
