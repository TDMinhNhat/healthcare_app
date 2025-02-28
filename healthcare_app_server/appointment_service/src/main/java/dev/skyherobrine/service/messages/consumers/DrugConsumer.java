package dev.skyherobrine.service.messages.consumers;

import dev.skyherobrine.service.models.Drug;
import dev.skyherobrine.service.repositories.DrugRepository;
import dev.skyherobrine.service.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DrugConsumer {

    private final DrugRepository drugRepository;

    public DrugConsumer(DrugRepository drugRepository) {
        this.drugRepository = drugRepository;
    }

    @KafkaListener(topics = "insert_drug", groupId = "appointment_insert_drug")
    public void insertDrug(String message) {
        try {
            log.info("Drug Consumer: listening insert drug message");
            log.info("Drug Consumer: {}", message);
            Drug target = ObjectParser.convertJsonToObject(message, Drug.class);
            drugRepository.save(target);
        } catch (Exception e) {
            log.error("Drug Consumer: can't insert drug");
            log.error(e.getMessage());
        }
    }
}
