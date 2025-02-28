package dev.skyherobrine.service.messages.consumes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.service.models.mariadb.Appointment;
import dev.skyherobrine.service.repositories.mariadb.AppointmentRepository;
import dev.skyherobrine.service.repositories.mariadb.DoctorRepository;
import dev.skyherobrine.service.repositories.mariadb.PatientRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.io.StringReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
@Slf4j
public class AppointmentConsumer {

    private final AppointmentRepository ar;
    private final PatientRepository pr;
    private final DoctorRepository dr;

    public AppointmentConsumer(AppointmentRepository ar, PatientRepository pr, DoctorRepository dr) {
        this.ar = ar;
        this.pr = pr;
        this.dr = dr;
    }

    @KafkaListener(topics = "insert_appointment", groupId = "admin_insert_appointment")
    public void insertAppointment(String message) {
        try {
            log.info("Appointment Consumer: receive insert appointment message from kafka");
            log.info("Appointment Consumer: {}", message);

            JsonNode node = new ObjectMapper().readTree(message);
            String getPatient = node.get("appointment").get("patientId").asText();
            String getDoctor = node.get("appointment").get("doctorId").asText();
            String getNote = node.get("appointment").get("note").asText();
            String getStartTime = node.get("appointment").get("start").asText();
            String getRoomId = node.get("roomId").asText();

            log.info("Appointment Consumer: {}", (getPatient + " - " + getDoctor + " - " + getNote + " - " + getStartTime + " - " + getRoomId));
            Appointment appointment = new Appointment(
                    pr.findPatientByUserId(getPatient).orElseThrow(() -> new EntityNotFoundException("Patient not found")),
                    dr.findDoctorByUserId(getDoctor).orElseThrow(() -> new EntityNotFoundException("Doctor not found")),
                    getNote,
                    LocalDateTime.parse(getStartTime, DateTimeFormatter.ofPattern("dd-MM-yyyy-HH-mm-ss")),
                    LocalDateTime.parse(getStartTime, DateTimeFormatter.ofPattern("dd-MM-yyyy-HH-mm-ss")).plusHours(1)
            );
            ar.save(appointment);
        } catch (Exception e) {
            log.error("Appointment Consumer: Can't add the book appointment");
            log.error(e.getMessage());
        }
    }
}
