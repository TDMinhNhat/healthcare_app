package dev.skyherobrine.service.services;

import dev.skyherobrine.service.dtos.BookAppointmentDTO;
import dev.skyherobrine.service.models.Appointment;
import dev.skyherobrine.service.repositories.AppointmentRepository;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {

    private final AppointmentRepository ar;

    public AppointmentService(AppointmentRepository ar) {
        this.ar = ar;
    }

    public Appointment addAppointment(BookAppointmentDTO dto) {
        Appointment appointment = dto.toObject();
    }

    private Long getMaximumId() {

    }

    private String generateAppointmentId() {

    }
}
