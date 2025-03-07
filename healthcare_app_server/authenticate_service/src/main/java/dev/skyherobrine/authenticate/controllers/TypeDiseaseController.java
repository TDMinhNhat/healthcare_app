package dev.skyherobrine.authenticate.controllers;

import dev.skyherobrine.authenticate.models.mariadb.Response;
import dev.skyherobrine.authenticate.repositories.mariadb.DoctorRepository;
import dev.skyherobrine.authenticate.repositories.mariadb.TypeDiseaseRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/authenticate/api/v1/type_disease")
@Slf4j
public class TypeDiseaseController {

    private final TypeDiseaseRepository typeDiseaseRepository;
    private final DoctorRepository doctorRepository;

    public TypeDiseaseController(TypeDiseaseRepository typeDiseaseRepository, DoctorRepository doctorRepository) {
        this.typeDiseaseRepository = typeDiseaseRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public ResponseEntity<Response> getAll() {
        log.info("Type Disease: Call the api get all types");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all types successfully",
                typeDiseaseRepository.findAll()
        ));
    }

    @GetMapping("/doctor")
    public ResponseEntity<Response> getDoctorsByTypeDisease(@RequestParam String typeName) {
        log.info("Type Disease: Call the api get the doctors by type disease");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all the doctors by type disease name",
                doctorRepository.findByTypeDisease_Name(typeName)
        ));
    }
}
