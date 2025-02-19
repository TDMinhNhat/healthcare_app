package dev.skyherobrine.service.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.service.enums.GroupMemberRole;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "group_members")
@Getter @Setter @NoArgsConstructor @RequiredArgsConstructor
public class GroupMember {
    @MongoId @Field(targetType = FieldType.INT64) @NonNull
    private Long id;
    @Field(targetType = FieldType.STRING) @NonNull
    private String groupId;
    @Field(targetType = FieldType.STRING) @NonNull
    private String userId;
    @Field(targetType = FieldType.STRING) @NonNull
    private GroupMemberRole role;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(targetType = FieldType.DATE_TIME) @NonNull
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(targetType = FieldType.DATE_TIME) @NonNull
    private LocalDateTime updatedAt;
    @Field(targetType = FieldType.BOOLEAN) @NonNull
    private Boolean isRemoved;
}
