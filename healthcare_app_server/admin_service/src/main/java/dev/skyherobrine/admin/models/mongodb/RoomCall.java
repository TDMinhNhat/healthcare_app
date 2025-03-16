package dev.skyherobrine.admin.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "room_calls")
@Getter @Setter
@NoArgsConstructor
public class RoomCall {
    @MongoId
    private Long id;

    @Field(name = "book_appointment_id")
    private BookAppointment bookAppointment;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(targetType = FieldType.DATE_TIME)
    private LocalDateTime start;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(targetType = FieldType.DATE_TIME)
    private LocalDateTime end;

    @Field(name = "created_at", targetType = FieldType.DATE_TIME)
    private LocalDateTime createdAt;

    public RoomCall(Long id, BookAppointment bookAppointment, LocalDateTime start) {
        this.id = id;
        this.bookAppointment = bookAppointment;
        this.start = start;
        this.end = null;
        this.createdAt = LocalDateTime.now();
    }
}
