package dev.skyherobrine.service.dtos;

import dev.skyherobrine.service.models.Appointment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class AppointmentDTO {

    private String patientId;
    private String doctorId;
    private String note;
    private LocalDateTime start;
    private LocalDateTime end;

    public Appointment toObject() {
        return new Appointment(
            patientId,
            doctorId,
            note,
            start,
            end
        );
    }
}
