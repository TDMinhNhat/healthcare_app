package dev.skyherobrine.service.models.mongodb;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "calls")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Call {
    @MongoId
    private Long id;
    private Appointment appointment;
    @Field(targetType = FieldType.DATE_TIME)
    private LocalDateTime start;
    @Field(targetType = FieldType.DATE_TIME)
    private LocalDateTime end;
    @Field(name = "created_at", targetType = FieldType.DATE_TIME)
    private LocalDateTime createdAt;
}
