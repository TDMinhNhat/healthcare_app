package dev.skyherobrine.service.controllers.impl;

import dev.skyherobrine.service.controllers.IManagement;
import dev.skyherobrine.service.dtos.DrugDTO;
import dev.skyherobrine.service.models.mariadb.Drug;
import dev.skyherobrine.service.models.mariadb.Response;
import dev.skyherobrine.service.repositories.mariadb.DrugRepository;
import dev.skyherobrine.service.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/api/v1/drug")
@Slf4j
public class DrugController implements IManagement<DrugDTO,Long> {

    private final DrugRepository drugRepository;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public DrugController(DrugRepository drugRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.drugRepository = drugRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @GetMapping
    @Override
    public ResponseEntity<Response> getAll() {
        log.info("Drug: Call api for getting all drugs");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all drugs",
                drugRepository.findAll()
        ));
    }

    @Override
    public ResponseEntity<Response> getById(Long aLong) {
        return null;
    }

    @PostMapping
    @Override
    public ResponseEntity<Response> add(@RequestBody DrugDTO drugDTO) {
        try {
            log.info("Drug: Call api for adding drug");
            Drug drug = drugDTO.toObject();
            log.info("Drug: sending insert drug message to kafka");
            kafkaTemplate.send("insert_drug", ObjectParser.convertObjectToJson(drug));
            log.info("Drug: saving drug into database");
            drugRepository.save(drug);
            log.info("Drug: drug saved successfully");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "The api add drug is called successfully",
                    "Drug added successfully"
            ));
        } catch (Exception e) {
            log.error("Drug: add drug error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api add drug thrown an exception",
                    e.getMessage()
            ));
        }
    }

    @Override
    public ResponseEntity<Response> update(Long aLong, DrugDTO drugDTO) {
        return null;
    }

    @Override
    public ResponseEntity<Response> delete(Long aLong) {
        return null;
    }
}
