package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.models.mariadb.Doctor;
import dev.skyherobrine.service.models.mariadb.Patient;
import dev.skyherobrine.service.models.mariadb.Response;
import dev.skyherobrine.service.repositories.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/authenticate/api/v1/user")
@Slf4j
public class UserController {

    private final PatientRepository pr;
    private final DoctorRepository dr;
    private final DoctorCertificateRepository doctorCertificateRepository;
    private final DoctorEducationRepository doctorEducationRepository;
    private final DoctorExperienceRepository doctorExperienceRepository;

    public UserController(PatientRepository pr, DoctorRepository dr, DoctorCertificateRepository doctorCertificateRepository, DoctorEducationRepository doctorEducationRepository, DoctorExperienceRepository doctorExperienceRepository) {
        this.pr = pr;
        this.dr = dr;
        this.doctorCertificateRepository = doctorCertificateRepository;
        this.doctorEducationRepository = doctorEducationRepository;
        this.doctorExperienceRepository = doctorExperienceRepository;
    }

    @GetMapping("/patient")
    public ResponseEntity<Response> findPatient(@RequestParam("userId") String userId) {
        try {
            log.info("User: Call api find the patient");
            Patient patient = pr.findPatientByUserId(userId).orElse(null);
            if(patient != null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Get the patient successfully",
                        patient
                ));
            }
            return ResponseEntity.ok(new Response(
                    HttpStatus.NOT_FOUND.value(),
                    "The patient not found",
                    null
            ));
        } catch (Exception e) {
            log.error("User: Can't get the patient");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The server can't get the patient",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/doctor")
    public ResponseEntity<Response> findDoctor(@RequestParam("userId") String userId) {
        try {
            log.info("User: Call api find the doctor");
            Map<String,Object> result = new HashMap<>();
            Doctor doctor = dr.findDoctorByUserId(userId).orElse(null);
            if(doctor != null) {
                result.put("doctor", doctor);
                result.put("certificates", doctorCertificateRepository.findByDoctor(doctor));
                result.put("educations", doctorEducationRepository.findByDoctor(doctor));
                result.put("experiences", doctorExperienceRepository.findByDoctor(doctor));

                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Get the doctor successfully",
                        result
                ));
            }
            return ResponseEntity.ok(new Response(
                    HttpStatus.NOT_FOUND.value(),
                    "The doctor not found",
                    null
            ));
        } catch (Exception e) {
            log.error("User: Can't get the doctor");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The server can't get the doctor",
                    e.getMessage()
            ));
        }
    }
}
