package dev.skyherobrine.service.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "group_chats")
@Getter @Setter @NoArgsConstructor @RequiredArgsConstructor
public class GroupChat {
    @MongoId @Field(targetType = FieldType.INT64) @NonNull
    private Long id;

    @Field(targetType = FieldType.STRING) @NonNull
    private String senderId;

    @Field(targetType = FieldType.STRING) @NonNull
    private String groupId;

    @Field(targetType = FieldType.STRING) @NonNull
    private String message;

    @Field(name = "is_recall", targetType = FieldType.BOOLEAN) @NonNull
    private Boolean isRecall;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(name = "created_at", targetType = FieldType.DATE_TIME) @NonNull
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(name = "updated_at", targetType = FieldType.DATE_TIME) @NonNull
    private LocalDateTime updatedAt;

}
