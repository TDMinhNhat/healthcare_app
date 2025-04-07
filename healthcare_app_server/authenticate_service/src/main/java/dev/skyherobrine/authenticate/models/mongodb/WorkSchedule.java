package dev.skyherobrine.authenticate.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.authenticate.enums.TypeDay;
import dev.skyherobrine.authenticate.models.mariadb.Doctor;
import dev.skyherobrine.authenticate.models.mariadb.Shift;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Document(collection = "work_schedules")
@Getter @Setter
@NoArgsConstructor
public class WorkSchedule {
    @MongoId
    private Long id;
    private Doctor doctor;
    private Shift shift;
    @Field(name = "max_slots")
    private int maxSlots;
    @JsonFormat(pattern = "dd-MM-yyyy")
    @Field(name = "date_appointment")
    private LocalDate dateAppointment;
    @Field(name = "created_at")
    private LocalDateTime createdAt;
    @Field(name = "updated_at")
    private LocalDateTime updatedAt;
    private boolean status;

    public WorkSchedule(Long id, Doctor doctor, Shift shift, int maxSlots, String dateAppointment) {
        this.id = id;
        this.doctor = doctor;
        this.shift = shift;
        this.maxSlots = maxSlots;
        this.dateAppointment = LocalDate.parse(dateAppointment, DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        this.createdAt = this.updatedAt = LocalDateTime.now();
        this.status = true;
    }
}
