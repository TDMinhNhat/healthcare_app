package dev.skyherobrine.admin.controllers.impl;

import dev.skyherobrine.admin.controllers.IManagement;
import dev.skyherobrine.admin.dtos.DrugDTO;
import dev.skyherobrine.admin.models.mariadb.Drug;
import dev.skyherobrine.admin.models.mariadb.Response;
import dev.skyherobrine.admin.repositories.mariadb.DrugRepository;
import dev.skyherobrine.admin.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
            Drug result = drugRepository.save(drug);
            log.info("Drug: drug saved successfully");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "The api add drug is called successfully",
                    result
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

    @PutMapping("/{id}")
    @Override
    public ResponseEntity<Response> update(@PathVariable("id") Long id, @RequestBody DrugDTO drugDTO) {
        try {
            log.info("Drug: Call api for updating drug");
            Drug drug = drugRepository.findById(id).orElse(null);
            if(drug != null) {
                drug.setDrugName(drugDTO.getDrugName());
                drug.setDrugType(drugDTO.getDrugType());
                drug.setUnit(drugDTO.getUnit());
                log.info("Drug: sending update drug message to kafka");

                Map<String,Object> dataSend = new HashMap<>();
                dataSend.put("id", id);
                dataSend.put("drug", drugDTO);
                kafkaTemplate.send("update_drug", ObjectParser.convertObjectToJson(dataSend));
                log.info("Drug: updating drug into database");
                Drug result = drugRepository.save(drug);
                log.info("Drug: drug updated successfully");
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "The api update drug is called successfully",
                        result
                ));
            } else {
                return ResponseEntity.ok(new Response(
                        HttpStatus.NOT_FOUND.value(),
                        "The api update drug is called but the drug not found",
                        "Drug not found"
                ));
            }
        } catch (Exception e) {
            log.error("Drug: update drug error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api update drug thrown an exception",
                    e.getMessage()
            ));
        }
    }


    @Override
    public ResponseEntity<Response> delete(Long aLong) {
        return null;
    }

    @PostMapping("/import")
    public ResponseEntity<Response> importDrug(@RequestBody List<DrugDTO> drugs) {
        try {
            log.info("Drug: Call api for importing drugs");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "The api import drug is called successfully",
                    drugRepository.saveAll(drugs.stream().map(item -> {
                        try {
                            Drug drug = item.toObject();
                            log.info("Drug: sending insert drug message to kafka");
                            kafkaTemplate.send("insert_drug", ObjectParser.convertObjectToJson(drug));
                            log.info("Drug: saving drug into database");
                            return drugRepository.save(drug);
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    }).toList())
            ));
        } catch (Exception e) {
            log.error("Drug: import drug error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api import drug thrown an exception",
                    e.getMessage()
            ));
        }
    }
}
