package dev.skyherobrine.authenticate.messages.consumers;

import dev.skyherobrine.authenticate.models.mariadb.Patient;
import dev.skyherobrine.authenticate.repositories.mariadb.PatientRepository;
import dev.skyherobrine.authenticate.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class PatientConsumer {

    private final PatientRepository patientRepository;

    public PatientConsumer(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @KafkaListener(topics = "delete_patient", groupId = "authenticate_delete_patient")
    public void deletePatient(String message) {
        try {
            log.info("Patient Consumer: listen the message for deleting patient");
            log.info("Patient Consumer: " + message);

            Patient patient = patientRepository.findPatientByUserId(ObjectParser.convertJsonToObject(message, String.class)).orElse(null);
            if(patient != null) {
                patient.setStatus(false);
                patientRepository.save(patient);
                log.info("Patient Consumer: Patient deleted successfully");
                return;
            }
            log.warn("Patient Consumer: Patient not found");
        } catch (Exception e) {
            log.error("Patient Consumer: the consumer thrown an error");
            log.error(e.getMessage());
        }
    }
}
