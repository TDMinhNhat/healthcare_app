package dev.skyherobrine.admin.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.admin.enums.AppointmentStatus;
import lombok.*;

import java.time.LocalDateTime;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "appointments")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor @AllArgsConstructor
public class Appointment {

    @MongoId
    private Long id;
    @Field(name = "patient_id") @NonNull
    private String patient;
    @Field(name = "work_schedule_id") @NonNull
    private Long workSchedule;
    private String note;
    @Field(name = "room_id")
    private String roomId;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(name = "created_at", targetType = FieldType.DATE_TIME)
    private LocalDateTime createdAt;
    private AppointmentStatus status;

    public Appointment(@NonNull String patient, @NonNull Long workSchedule, String note) {
        this.patient = patient;
        this.workSchedule = workSchedule;
        this.note = note;
        this.status = AppointmentStatus.WAITING;
        createdAt = LocalDateTime.now();
    }
}
