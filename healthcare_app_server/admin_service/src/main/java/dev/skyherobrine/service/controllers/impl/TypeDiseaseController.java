package dev.skyherobrine.service.controllers.impl;

import dev.skyherobrine.service.controllers.IManagement;
import dev.skyherobrine.service.models.mariadb.Response;
import dev.skyherobrine.service.models.mariadb.TypeDisease;
import dev.skyherobrine.service.repositories.mariadb.TypeDiseaseRepository;
import dev.skyherobrine.service.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/api/v1/type_disease")
@Slf4j
public class TypeDiseaseController implements IManagement<String, Long> {

    private final TypeDiseaseRepository typeDiseaseRepository;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public TypeDiseaseController(TypeDiseaseRepository typeDiseaseRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.typeDiseaseRepository = typeDiseaseRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @GetMapping
    @Override
    public ResponseEntity<Response> getAll() {
        log.info("Type Disease: Call the api get all type of disease");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all of type diseases",
                typeDiseaseRepository.findAll()
        ));
    }

    @Override
    public ResponseEntity<Response> getById(Long aLong) {
        return null;
    }

    @PostMapping
    @Override
    public ResponseEntity<Response> add(@RequestBody String name) {
        try {
            log.info("Type Disease: Call the api insert type disease");
            TypeDisease typeDisease = new TypeDisease(name);

            log.info("Type Disease: send the message insert type disease");
            kafkaTemplate.send("insert_type_disease", ObjectParser.convertObjectToJson(typeDisease));

            TypeDisease result = typeDiseaseRepository.save(typeDisease);
            log.info("Type Disease: Insert type disease success");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Insert type disease success",
                    result
            ));
        } catch (Exception e) {
            log.error("Type Disease: Insert type disease failed");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Insert type disease failed",
                    null
            ));
        }
    }

    @Override
    public ResponseEntity<Response> update(Long aLong, String typeDisease) {
        return null;
    }

    @DeleteMapping("/{id}")
    @Override
    public ResponseEntity<Response> delete(@PathVariable("id") Long id) {
        try {
            log.info("Type Disease: Call the api delete type disease");
            TypeDisease typeDisease = typeDiseaseRepository.findById(id).orElse(null);
            if(typeDisease != null) {
                log.info("Type Disease: found the object");
                kafkaTemplate.send("delete_type_disease", ObjectParser.convertObjectToJson(String.valueOf(id)));

                typeDisease.setStatus(false);
                TypeDisease result = typeDiseaseRepository.save(typeDisease);
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Delete the type disease successfully",
                        result
                ));
            }
            log.info("Type Disease: Not found the object");
            return ResponseEntity.ok(new Response(
                    HttpStatus.NOT_FOUND.value(),
                    "Not found the type disease",
                    null
            ));
        } catch (Exception e) {
            log.error("Type Disease: Delete the type disease failed!");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }
}
