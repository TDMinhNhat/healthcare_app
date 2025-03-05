package dev.skyherobrine.service.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.service.enums.AppointmentStatus;
import dev.skyherobrine.service.models.mariadb.Patient;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "appointments")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor @AllArgsConstructor
public class Appointment {

    @MongoId
    private Long id;
    @Field(name = "patient_id")
    private Patient patient;
    @Field(name = "work_schedule_id") @NonNull
    private Long workScheduleId;
    private String note;
    @Field(name = "room_id")
    private String roomId;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(name = "created_at")
    private LocalDateTime createdAt;
    private AppointmentStatus status;

    public Appointment(@NonNull Patient patient, @NonNull Long workScheduleId, String note, String roomId) {
        this.patient = patient;
        this.workScheduleId = workScheduleId;
        this.note = note;
        this.roomId = roomId;
        this.status = AppointmentStatus.WAITING;
        this.createdAt = LocalDateTime.now();
    }
}
