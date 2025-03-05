package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.repositories.mariadb.DrugRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointment/api/v1/drug")
@Slf4j
public class DrugController {

    private final DrugRepository drugRepository;

    public DrugController(DrugRepository drugRepository) {
        this.drugRepository = drugRepository;
    }

    @GetMapping
    public ResponseEntity<Response> getDrugs() {
        log.info("Drug: Call the api get all drugs");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all drugs",
                drugRepository.findAll()
        ));
    }

    @GetMapping("/absolute")
    public ResponseEntity<Response> getDrugByAbsoluteName(@RequestParam String name) {
        log.info("Drug: Call the api get absolute drug by name");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get absolute drug by name",
                drugRepository.findByDrugNameContains(name)
        ));
    }
}
