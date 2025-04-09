package dev.skyherobrine.appointment.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EmergencyDTO {
    private String patientId;
    private String doctorId;
}
