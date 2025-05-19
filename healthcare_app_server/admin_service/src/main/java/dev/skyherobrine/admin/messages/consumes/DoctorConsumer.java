package dev.skyherobrine.admin.messages.consumes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.admin.models.mariadb.Doctor;
import dev.skyherobrine.admin.models.mariadb.Patient;
import dev.skyherobrine.admin.repositories.mariadb.DoctorRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DoctorConsumer {

    private final DoctorRepository doctorRepository;

    public DoctorConsumer(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @KafkaListener(topics = "update_doctor_avatar", groupId = "admin_update_doctor_avatar")
    public void updateDoctorAvatar(String message) {
        try {
            log.info("Doctor Consumer: listen for updating doctor avatar");
            log.info("Doctor Consumer: {}", message);

            JsonNode node = new ObjectMapper().readTree(message);
            String getDoctorId = node.get("doctorId").asText();
            String getURLAvatar = node.get("image").asText();

            Doctor doctor = doctorRepository.findDoctorByUserId(getDoctorId).orElse(null);
            if(doctor != null) {
                doctor.setAvatar(getURLAvatar);
                doctorRepository.save(doctor);
                log.info("Doctor Consumer: Doctor updated successfully");
            }
            log.warn("Doctor Consumer: Doctor was not found");

        } catch (Exception e) {
            log.error("Doctor Consumer: error while updating doctor avatar");
            log.error("Doctor Consumer: {}", e.getMessage());
        }
    }
}
