package dev.skyherobrine.service.messages.consumes;

import dev.skyherobrine.service.models.mongodb.Appointment;
import dev.skyherobrine.service.repositories.mongodb.AppointmentRepository;
import dev.skyherobrine.service.utils.ObjectParser;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class AppointmentConsumers {

    private final AppointmentRepository ar;

    public AppointmentConsumers(AppointmentRepository ar) {
        this.ar = ar;
    }

    @KafkaListener(topics = "insert_appointment", id = "admin_insert_appointment")
    public void insertAppointment(String message) throws Exception {
        Appointment appointment = ObjectParser.convertJsonToObject(message, Appointment.class);
        Appointment newAppointment = new Appointment(
                appointment.getCreatedAt(),
                appointment.getUserId(),
                appointment.getDoctorId(),
                appointment.getAddress(),
                appointment.getAppointmentDate(),
                appointment.getStatus()
        );
        ar.save(newAppointment);
    }
}
