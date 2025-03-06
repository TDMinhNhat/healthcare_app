package dev.skyherobrine.service.controllers.impl;

import dev.skyherobrine.service.controllers.IManagement;
import dev.skyherobrine.service.models.mariadb.Patient;
import dev.skyherobrine.service.models.mariadb.Response;
import dev.skyherobrine.service.repositories.mariadb.PatientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/api/v1/patients")
@Slf4j
public class PatientController implements IManagement<Patient,Long> {

    private final PatientRepository patientRepository;

    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @GetMapping
    @Override
    public ResponseEntity<Response> getAll() {
        log.info("Patient: Call the api get all patients");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all the patients",
                patientRepository.findAll()
        ));
    }

    @Override
    public ResponseEntity<Response> getById(Long aLong) {
        return null;
    }

    @Override
    public ResponseEntity<Response> add(Patient patient) {
        return null;
    }

    @Override
    public ResponseEntity<Response> update(Long aLong, Patient patient) {
        return null;
    }

    @Override
    public ResponseEntity<Response> delete(Long aLong) {
        return null;
    }

    @GetMapping("/user_id")
    public ResponseEntity<Response> getAllUserId() {
        log.info("Patient: Call the api get all patients user id");
        List<String> results = patientRepository.findAll().stream().map(Patient::getUserId).toList();
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all the patients user id",
                results
        ));
    }
}
