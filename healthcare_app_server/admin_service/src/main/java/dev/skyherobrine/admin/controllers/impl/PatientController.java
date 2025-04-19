package dev.skyherobrine.admin.controllers.impl;

import dev.skyherobrine.admin.controllers.IManagement;
import dev.skyherobrine.admin.dtos.PatientRegisterDTO;
import dev.skyherobrine.admin.models.mariadb.Patient;
import dev.skyherobrine.admin.models.mariadb.Response;
import dev.skyherobrine.admin.repositories.mariadb.PatientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/admin/api/v1/patients")
@Slf4j
public class PatientController implements IManagement<Patient,Long> {

    private final RestTemplate restTemplate = new RestTemplate();
    private final PatientRepository patientRepository;
    @Value("${domain-host-name}")
    private String domainHostName;

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

    @PostMapping("/import")
    public ResponseEntity<Response> importPatients(@RequestBody List<PatientRegisterDTO> patients) {
        try {
            log.info("Patient: Call the api import patients");
            patients.forEach(patient -> {
                Response result = restTemplate.postForObject("http://" + domainHostName + ":9000/authenticate/api/v1/authenticate/register", patient, Response.class);
                if(result.getCode() != 200) {
                    log.error("Patient: send request to the api has an error");
                    throw new RuntimeException("Patient: the authenticate api thrown an error, message: " + result.getMessage());
                }
            });
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Successfully imported patients",
                    patientRepository.findAll()
            ));
        } catch (Exception e) {
            log.error("Patient: the api thrown an error");
            log.error("Patient: {}", e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/patient_id")
    public ResponseEntity<Response> getPatientByPatientId(
            @RequestParam("patientId") String patientId
    ) {
        log.info("Patient: Call the api get patient by patient id");
        Patient patient = patientRepository.findPatientByUserId(patientId).orElse(null);
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get patient by patient id",
                patient
        ));
    }
}
