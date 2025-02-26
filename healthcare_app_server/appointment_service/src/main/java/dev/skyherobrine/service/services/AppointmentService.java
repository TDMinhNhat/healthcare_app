package dev.skyherobrine.service.services;

import dev.skyherobrine.service.models.Appointment;
import dev.skyherobrine.service.repositories.AppointmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class AppointmentService {

    private final AppointmentRepository ar;

    public AppointmentService(AppointmentRepository ar) {
        this.ar = ar;
    }

    public List<Appointment> getAppointmentsByPatient(String patientId) {
        log.info("Appointment Service: Call get appointments follow the patient id");
        List<Appointment> appointments = ar.findByPatient(patientId);

        if(appointments.isEmpty()) {
            log.info("Appointment Service: There are no any appointments for this patient");
            return null;
        }
        log.info("Appointment Service: Found {} appointments for this patient", appointments.size());

        return appointments;
    }

    public List<Appointment> getAppointmentsByDoctor(String doctorId) {
        log.info("Appointment Service: Call get appointments follow the doctor id");
        List<Appointment> appointments = ar.findByDoctor(doctorId);

        if(appointments.isEmpty()) {
            log.info("Appointment Service: There are no any appointments for this doctor");
            return null;
        }
        log.info("Appointment Service: Found {} appointments for this doctor", appointments.size());

        return appointments;
    }
}
