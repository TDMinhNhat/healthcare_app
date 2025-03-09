package dev.skyherobrine.appointment.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "appointments")
@Getter @Setter
@NoArgsConstructor
public class Appointment {

    @MongoId
    private Long id;
    @Field(name = "work_schedule_id")
    private Long workScheduleId;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(name = "created_at")
    private LocalDateTime createdAt;

    public Appointment(Long id, Long workScheduleId) {
        this.id = id;
        this.workScheduleId = workScheduleId;
    }
}
