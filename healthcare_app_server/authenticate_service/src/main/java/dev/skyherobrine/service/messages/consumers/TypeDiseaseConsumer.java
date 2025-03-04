package dev.skyherobrine.service.messages.consumers;

import dev.skyherobrine.service.models.TypeDisease;
import dev.skyherobrine.service.repositories.TypeDiseaseRepository;
import dev.skyherobrine.service.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class TypeDiseaseConsumer {

    private final TypeDiseaseRepository typeDiseaseRepository;

    public TypeDiseaseConsumer(TypeDiseaseRepository typeDiseaseRepository) {
        this.typeDiseaseRepository = typeDiseaseRepository;
    }

    @KafkaListener(topics = "insert_type_disease", groupId = "authenticate_insert_type_disease")
    public void insertTypeDisease(String message) {
        try {
            log.info("Type Disease Consumer: listen the message insert type disease");
            TypeDisease target = ObjectParser.convertJsonToObject(message, TypeDisease.class);
            typeDiseaseRepository.save(target);
            log.info("Type Disease Consumer: insert type disease successfully!");
        } catch (Exception e) {
            log.error("Type Disease Consumer: insert the type disease failed!");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "delete_type_disease", groupId = "authenticate_delete_type_disease")
    public void deleteTypeDisease(String message) {
        try {
            log.info("Type Disease Consumer: listen the message delete type disease");
            Long getId = ObjectParser.convertJsonToObject(message, Long.class);
            TypeDisease target = typeDiseaseRepository.findById(getId).orElseThrow(() -> new EntityNotFoundException("The type disease id wasn't found!"));
            target.setStatus(false);
            typeDiseaseRepository.save(target);
            log.info("Type Disease Consumer: delete type disease successfully!");
        } catch (Exception e) {
            log.error("Type Disease Consumer: delete type disease failed!");
            log.error(e.getMessage());
        }
    }
}