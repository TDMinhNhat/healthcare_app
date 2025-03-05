package dev.skyherobrine.service.messages.consumes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.service.enums.AppointmentStatus;
import dev.skyherobrine.service.models.mongodb.Appointment;
import dev.skyherobrine.service.repositories.mongodb.AppointmentRepository;
import dev.skyherobrine.service.repositories.mariadb.DoctorRepository;
import dev.skyherobrine.service.repositories.mariadb.PatientRepository;
import dev.skyherobrine.service.repositories.mongodb.WorkScheduleRepository;
import dev.skyherobrine.service.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AppointmentConsumer {

    private final AppointmentRepository ar;
    private final PatientRepository pr;
    private final DoctorRepository dr;
    private final WorkScheduleRepository workScheduleRepository;

    public AppointmentConsumer(AppointmentRepository ar, PatientRepository pr, DoctorRepository dr, WorkScheduleRepository workScheduleRepository) {
        this.ar = ar;
        this.pr = pr;
        this.dr = dr;
        this.workScheduleRepository = workScheduleRepository;
    }

    @KafkaListener(topics = "insert_appointment", groupId = "admin_insert_appointment")
    public void insertAppointment(String message) {
        try {
            log.info("Appointment Consumer: receive insert appointment message from kafka");
            log.info("Appointment Consumer: {}", message);

            JsonNode node = new ObjectMapper().readTree(message);
            String getPatient = node.get("appointment").get("patientId").asText();
            Long getWorkSchedule = node.get("appointment").get("workSchedule").asLong();
            String getNote = node.get("appointment").get("note").asText();
            String getRoomId = node.get("roomId").asText();

            Appointment appointment = new Appointment(
                    pr.findPatientByUserId(getPatient).orElseThrow(() -> new EntityNotFoundException("Patient not found")),
                    workScheduleRepository.findById(getWorkSchedule).orElseThrow(() -> new EntityNotFoundException("Work schedule not found")).getId(),
                    getNote,
                    getRoomId
            );
            ar.save(appointment);
        } catch (Exception e) {
            log.error("Appointment Consumer: Can't add the book appointment");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "update_cancel_appointment", groupId = "admin_update_cancel_appointment")
    public void updateCancelAppointment(String message) {
        try {
            log.info("Appointment Consumer: receive update cancel appointment message from kafka");
            log.info("Appointment Consumer: {}", message);
            String getRoomId = ObjectParser.convertJsonToObject(message, String.class);
            Appointment appointment = ar.findAppointmentByRoomId(getRoomId).orElseThrow(() -> new EntityNotFoundException("The appointment wasn't found!"));
            appointment.setStatus(AppointmentStatus.CANCELLED);
            ar.save(appointment);
            log.info("Appointment Consumer: update the status appointment successfully!");
        } catch (Exception e) {
            log.error("Appointment Consumer: Can't update the cancel appointment");
            log.error(e.getMessage());
        }
    }
}
