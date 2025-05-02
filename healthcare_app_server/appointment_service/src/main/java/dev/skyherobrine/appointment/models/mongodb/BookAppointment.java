package dev.skyherobrine.appointment.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.appointment.enums.AppointmentStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "book_appointments")
@Getter @Setter
@NoArgsConstructor
public class BookAppointment {

    @MongoId
    private Long id;

    @Field(name = "patient_id")
    private String patientId;

    @Field(name = "work_schedule_id")
    private Long workSchedule;

    @Field(name = "numerical_order")
    private int numericalOrder;

    private String note;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(name = "created_at")
    private LocalDateTime createdAt;

    private AppointmentStatus status;

    public BookAppointment(Long id, String patientId, Long workSchedule, int numericalOrder, String note) {
        this.id = id;
        this.patientId = patientId;
        this.workSchedule = workSchedule;
        this.numericalOrder = numericalOrder;
        this.note = note;
        this.createdAt = LocalDateTime.now();
        this.status = AppointmentStatus.WAITING;
    }
}
