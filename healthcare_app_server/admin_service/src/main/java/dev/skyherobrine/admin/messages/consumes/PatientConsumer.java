package dev.skyherobrine.admin.messages.consumes;

import dev.skyherobrine.admin.models.mariadb.Patient;
import dev.skyherobrine.admin.repositories.mariadb.PatientRepository;
import dev.skyherobrine.admin.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

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
            log.error("Patient Consumer: the listener failed to update the patient");
            log.error(e.getMessage());
        }
    }
}
