package dev.skyherobrine.appointment.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.admin.enums.AppointmentStatus;
import dev.skyherobrine.admin.models.mariadb.Patient;
import dev.skyherobrine.admin.models.mongodb.Appointment;
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

    @Field(name = "appointment_id")
    private String appointmentId;

    @Field(name = "numerical_order")
    private int numericalOrder;

    private String note;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Field(name = "created_at")
    private LocalDateTime createdAt;

    private AppointmentStatus status;

    public BookAppointment(Long id, String patientId, String appointmentId, int numericalOrder, String note) {
        this.id = id;
        this.patientId = patientId;
        this.appointmentId = appointmentId;
        this.numericalOrder = numericalOrder;
        this.note = note;
        this.createdAt = LocalDateTime.now();
        this.status = AppointmentStatus.WAITING;
    }
}
