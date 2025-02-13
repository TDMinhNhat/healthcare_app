package dev.skyherobrine.service.dtos;

import dev.skyherobrine.service.enums.AppointmentStatus;
import dev.skyherobrine.service.models.Appointment;

import java.time.LocalDateTime;

public class BookAppointmentDTO {
    private Long userId;
    private Long doctorId;
    private String description;
    private String address;
    private String appointmentDate;

    public Appointment toObject() {
        String[] splitDate = appointmentDate.split("-");
        LocalDateTime getDateTime = LocalDateTime.of(
                Integer.parseInt(splitDate[2]),
                Integer.parseInt(splitDate[1]),
                Integer.parseInt(splitDate[0]),
                Integer.parseInt(splitDate[3]),
                Integer.parseInt(splitDate[4]),
                Integer.parseInt(splitDate[5])
        );
        return new Appointment(
                LocalDateTime.now(),
                userId,
                doctorId,
                description,
                address,
                getDateTime,
                AppointmentStatus.WAITING
        );
    }
}
