package dev.skyherobrine.service.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.service.enums.AppointmentStatus;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "appointments")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class Appointment {
    @MongoId @Field(name = "created_at")
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss") @NonNull
    private LocalDateTime createdAt;
    @Field(name = "user_id") @NonNull
    private Long userId;
    @Field(name = "doctor_id") @NonNull
    private Long doctorId;
    private String description;
    @NonNull
    private String address;
    @Field(name = "appointment_date")
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @NonNull
    private LocalDateTime appointmentDate;
    @Field(targetType = FieldType.STRING) @NonNull
    private AppointmentStatus status;

    public Appointment(@NonNull LocalDateTime createdAt, @NonNull Long userId, @NonNull Long doctorId, String description, @NonNull String address, @NonNull LocalDateTime appointmentDate, @NonNull AppointmentStatus status) {
        this.createdAt = createdAt;
        this.userId = userId;
        this.doctorId = doctorId;
        this.description = description;
        this.address = address;
        this.appointmentDate = appointmentDate;
        this.status = status;
    }
}
