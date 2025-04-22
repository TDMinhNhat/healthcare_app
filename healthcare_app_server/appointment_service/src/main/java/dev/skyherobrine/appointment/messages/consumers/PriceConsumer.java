package dev.skyherobrine.appointment.messages.consumers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.appointment.models.mariadb.Price;
import dev.skyherobrine.appointment.repositories.mariadb.PriceRepository;
import dev.skyherobrine.appointment.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class PriceConsumer {

    private final PriceRepository priceRepository;

    public PriceConsumer(PriceRepository priceRepository) {
        this.priceRepository = priceRepository;
    }

    @KafkaListener(topics = "insert_price", groupId = "appointment_insert_price")
    public void addPrice(String message) {
        try {
            log.info("Price Consumer: listen the message for inserting price");
            log.info("Price Consumer: {}", message);

            JsonNode node = new ObjectMapper().readTree(message);
            String getPriceType = node.get("priceType").asText();
            Double getPrice = node.get("price").asDouble();

            Price price = new Price(getPrice, getPriceType);
            priceRepository.save(price);
            log.info("Price Consumer: add price successfully");
        } catch (Exception e) {
            log.error("Price Consumer: the consumer thrown an error");
            log.error("Price Consumer: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "update_price", groupId = "appointment_update_price")
    public void updatePrice(String message) {
        try {
            log.info("Price Consumer: listen the message for updating price");
            log.info("Price Consumer: {}", message);

            JsonNode node = new ObjectMapper().readTree(message);
            Long getPriceId = node.get("id").asLong();
            Double getPrice = node.get("price").asDouble();
            String getPriceType = node.get("priceType").asText();

            Price price = priceRepository.findById(getPriceId).orElse(null);
            if(price != null) {
                log.error("Price Consumer: price not found");
                price.setPrice(getPrice);
                price.setPriceType(getPriceType);
                priceRepository.save(price);
                log.info("Price Consumer: update price successfully");
            } else {
                price = new Price(getPrice, getPriceType);
                priceRepository.save(price);
                log.info("Price Consumer: add price successfully");
            }
        } catch (Exception e) {
            log.error("Price Consumer: the consumer thrown an error");
            log.error("Price Consumer: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "delete_price", groupId = "appointment_delete_price")
    public void deletePrice(String message) {
        try {
            log.info("Price Consumer: listen the message for deleting price");
            log.info("Price Consumer: {}", message);

            Long getPriceId = ObjectParser.convertJsonToObject(message, Long.class);
            Price price = priceRepository.findById(getPriceId).orElse(null);
            if(price != null) {
                price.setStatus(false);
                priceRepository.save(price);
                log.info("Price Consumer: delete price successfully");
            } else {
                log.warn("Price Consumer: the price wasn't found!");
            }
        } catch (Exception e) {
            log.error("Price Consumer: the consumer thrown an error");
            log.error("Price Consumer: {}", e.getMessage());
        }
    }
}
