package dev.skyherobrine.appointment.services;

import dev.skyherobrine.appointment.dtos.EmergencyDTO;
import dev.skyherobrine.appointment.models.mongodb.Emergency;
import dev.skyherobrine.appointment.repositories.mongodb.EmergencyRepository;
import dev.skyherobrine.appointment.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmergencyService {

    private final EmergencyRepository emergencyRepository;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public EmergencyService(EmergencyRepository emergencyRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.emergencyRepository = emergencyRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public Emergency addEmergency(EmergencyDTO emergencyDTO) throws Exception {
        log.info("Emergency Service: add emergency data");

        Emergency emergency = new Emergency(
                getMaxId(),
                emergencyDTO.getPatientId(),
                emergencyDTO.getDoctorId()
        );

        kafkaTemplate.send("insert_emergency", ObjectParser.convertObjectToJson(emergency));
        log.info("Emergency Service: send data emergency to kafka");
        return emergencyRepository.save(emergency);
    }

    private Long getMaxId() {
        Emergency result = emergencyRepository.findTopByOrderByIdDesc().orElse(null);
        return result == null ? 1L : result.getId() + 1;
    }
}
