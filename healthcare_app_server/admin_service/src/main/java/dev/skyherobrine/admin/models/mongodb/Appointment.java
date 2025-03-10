package dev.skyherobrine.admin.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.admin.enums.AppointmentStatus;
import dev.skyherobrine.admin.models.mariadb.Patient;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "appointments")
@Getter @Setter
@NoArgsConstructor
public class Appointment {

    @MongoId
    private Long id;
    @Field(name = "work_schedule_id")
    private WorkSchedule workScheduleId;
    @JsonFormat(pattern = "dd-MM-yyyy")
    @Field(name = "date_appointment")
    private LocalDate dateAppointment;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(name = "created_at")
    private LocalDateTime createdAt;

    public Appointment(Long id, WorkSchedule workScheduleId, LocalDate dateAppointment) {
        this.id = id;
        this.workScheduleId = workScheduleId;
        this.dateAppointment = dateAppointment;
        createdAt = LocalDateTime.now();
    }
}
