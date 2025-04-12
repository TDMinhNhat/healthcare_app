package dev.skyherobrine.appointment.messages.consumers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.appointment.models.mariadb.Drug;
import dev.skyherobrine.appointment.repositories.mariadb.DrugRepository;
import dev.skyherobrine.appointment.utils.ObjectParser;
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

    @KafkaListener(topics = "update_drug", groupId = "appointment_update_drug")
    public void updateDrug(String message) {
        try {
            log.info("Drug Consumer: listening update drug message");
            log.info("Drug Consumer: {}", message);

            JsonNode node = new ObjectMapper().readTree(message);
            Long id = node.get("id").asLong();
            String drugName = node.get("drug").get("drugName").asText();
            String drugType = node.get("drug").get("drugType").asText();
            String unit = node.get("drug").get("unit").asText();

            Drug drug = drugRepository.findById(id).orElse(null);
            if(drug != null) {
                drug.setDrugName(drugName);
                drug.setDrugType(drugType);
                drug.setUnit(unit);
                drugRepository.save(drug);
            } else {
                log.warn("Drug Consumer: can't found the drug to update");
            }
        } catch (Exception e) {
            log.error("Drug Consumer: can't update drug");
            log.error(e.getMessage());
        }
    }
}
