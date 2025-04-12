package dev.skyherobrine.admin.messages.consumes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.admin.models.mariadb.Patient;
import dev.skyherobrine.admin.repositories.mariadb.PatientRepository;
import dev.skyherobrine.admin.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
@Slf4j
public class PatientConsumer {

    private final PatientRepository pr;

    public PatientConsumer(PatientRepository pr) {
        this.pr = pr;
    }

    @KafkaListener(topics = "insert_patient", groupId = "admin_insert_patient")
    public void insertPatient(String message) {
        try {
            log.info("Patient Consumer: listen the message insert patient");
            log.info("Patient Consumer: {}", message);
            Patient patient = ObjectParser.convertJsonToObject(message, Patient.class);
            pr.save(patient);
            log.info("Patient Consumer: Patient saved successfully");
        } catch (Exception e) {
            log.error("Patient Consumer: the listener failed to save the patient");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "update_verify_email", groupId = "admin_update_verify_email")
    public void updateVerifyEmail(String message) {
        try {
            log.info("Patient Consumer: listen the message update verify email");
            log.info("Patient Consumer: {}", message);
            String getEmail = ObjectParser.convertJsonToObject(message, String.class);
            Patient patient = pr.findPatientByEmail(getEmail).orElseThrow(() -> new EntityNotFoundException("There are no patients with this email"));
            patient.setEmailVerified(true);
            pr.save(patient);
            log.info("Patient Consumer: Patient updated successfully");
        } catch (Exception e) {
            log.error("Patient Consumer: the listener failed to update the verify email patient");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "update_patient_info", groupId = "admin_update_patient_info")
    public void updatePatientInfo(String message) {
        try {
            log.info("Patient Consumer: listen the message update patient info");
            log.info("Patient Consumer: {}", message);

            JsonNode node = new ObjectMapper().readTree(message);
            String getPatientId = node.get("patientId").asText();
            String getFirstName = node.get("data").get("firstName").asText();
            String getLastName = node.get("data").get("lastName").asText();
            Boolean getSex = node.get("data").get("sex").asBoolean();
            String getDob = node.get("data").get("dob").asText();
            String getPhone = node.get("data").get("phone").asText();
            String getEmail = node.get("data").get("email").asText();
            String getPassword = node.get("data").get("password").asText();

            Patient patient = pr.findPatientByUserId(getPatientId).orElseThrow(() -> new EntityNotFoundException("Patient not found"));
            patient.setFirstName(getFirstName);
            patient.setLastName(getLastName);
            patient.setSex(getSex);
            patient.setDob(LocalDate.parse(getDob, DateTimeFormatter.ofPattern("dd-MM-yyyy")));
            patient.setPhone(getPhone);
            patient.setEmail(getEmail);
            patient.setPassword(getPassword);
            pr.save(patient);
        } catch (Exception e) {
            log.error("Patient Consumer: the listener failed to update the patient");
            log.error(e.getMessage());
        }
    }
}
