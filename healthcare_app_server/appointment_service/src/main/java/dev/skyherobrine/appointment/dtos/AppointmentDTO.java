package dev.skyherobrine.appointment.dtos;

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
}
