package dev.skyherobrine.service.dtos;

import dev.skyherobrine.service.models.Appointment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class AppointmentDTO {

    private String patientId;
    private String doctorId;
    private String note;
    private String start;

    public Appointment toObject() {
        return new Appointment(
            patientId,
            doctorId,
            note,
            LocalDateTime.parse(start, DateTimeFormatter.ofPattern("dd-MM-yyyy-HH-mm-ss")),
            LocalDateTime.parse(start, DateTimeFormatter.ofPattern("dd-MM-yyyy-HH-mm-ss")).plusHours(1)
        );
    }
}
