package dev.skyherobrine.authenticate.messages.consumers;

import dev.skyherobrine.authenticate.models.mariadb.Shift;
import dev.skyherobrine.authenticate.repositories.mariadb.ShiftRepository;
import dev.skyherobrine.authenticate.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ShiftConsumer {

    private final ShiftRepository shiftRepository;

    public ShiftConsumer(ShiftRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    @KafkaListener(topics = "insert_shift", groupId = "authenticate_insert_shift")
    public void insertShift(String message) {
        try {
            log.info("Shift Consumer: listen the message for inserting the shift");
            log.info("Shift Consumer: {}", message);
            Shift target = ObjectParser.convertJsonToObject(message, Shift.class);
            shiftRepository.save(target);
            log.info("Shift Consumer: The shift has been inserted");
        } catch (Exception e) {
            log.error("Shift Consumer: The consumer thrown an exception");
            log.error(e.getMessage());
        }
    }
}
