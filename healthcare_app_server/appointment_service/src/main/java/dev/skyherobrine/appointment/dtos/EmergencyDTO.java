package dev.skyherobrine.appointment.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EmergencyDTO {
    private String patientId;
    private String doctorId;

    public EmergencyDTO(String patientId, String doctorId) {
        this.patientId = patientId;
        this.doctorId = doctorId;
    }
}
