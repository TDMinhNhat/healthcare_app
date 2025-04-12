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

    @KafkaListener(topics = "delete_shift", groupId = "authenticate_delete_shift")
    public void deleteShift(String message) {
        try {
            log.info("Shift Consumer: listen the message for deleting the shift");
            log.info("Shift Consumer: {}", message);

            Long getId = ObjectParser.convertJsonToObject(message, Long.class);
            Shift target = shiftRepository.findById(getId).orElse(null);
            if(target != null) {
                log.info("Shift Consumer: found the shift");
                target.setStatus(false);
                shiftRepository.save(target);
                log.info("Shift Consumer: The shift has been deleted");
            } else {
                log.warn("Shift Consumer: The shift wasn't found!");
            }
        } catch (Exception e) {
            log.error("Shift Consumer: The consumer thrown an exception");
            log.error(e.getMessage());
        }
    }
}
