package dev.skyherobrine.service.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.service.models.mariadb.Appointment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "rooms")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Room {
    @MongoId
    private Long id;
    private String roomId;
    private Appointment appointment;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(targetType = FieldType.DATE_TIME)
    private LocalDateTime createdAt;
}
