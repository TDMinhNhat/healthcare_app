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
    private Long workSchedule;
    private String note;

    public Appointment toObject() {
        return new Appointment(
            patientId,
            workSchedule,
            note
        );
    }
}
