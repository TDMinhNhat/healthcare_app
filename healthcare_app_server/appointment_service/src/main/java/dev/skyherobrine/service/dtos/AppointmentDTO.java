package dev.skyherobrine.service.dtos;

import dev.skyherobrine.service.models.mongodb.Appointment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
