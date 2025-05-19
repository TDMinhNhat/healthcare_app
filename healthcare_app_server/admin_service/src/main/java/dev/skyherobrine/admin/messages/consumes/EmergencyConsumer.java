package dev.skyherobrine.admin.messages.consumes;

import dev.skyherobrine.admin.models.mongodb.Emergency;
import dev.skyherobrine.admin.repositories.mongodb.EmergencyRepository;
import dev.skyherobrine.admin.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class EmergencyConsumer {

    private final EmergencyRepository emergencyRepository;

    public EmergencyConsumer(EmergencyRepository emergencyRepository) {
        this.emergencyRepository = emergencyRepository;
    }

    @KafkaListener(topics = "insert_emergency", groupId = "admin_insert_emergency")
    public void addEmergency(String message) {
        try {
            log.info("Emergency Consumer: listen the insert emergency message");
            log.info("Emergency Consumer: {}", message);

            Emergency emergency = ObjectParser.convertJsonToObject(message, Emergency.class);
            emergencyRepository.save(emergency);
        } catch (Exception e) {
            log.error("Emergency Consumer: the consumer thrown an error");
            log.error(e.getMessage());
        }
    }
}
