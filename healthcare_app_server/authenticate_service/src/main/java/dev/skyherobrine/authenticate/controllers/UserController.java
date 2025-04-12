package dev.skyherobrine.authenticate.controllers;

import dev.skyherobrine.authenticate.dtos.PatientRegisterDTO;
import dev.skyherobrine.authenticate.models.mariadb.Doctor;
import dev.skyherobrine.authenticate.models.mariadb.Patient;
import dev.skyherobrine.authenticate.models.mariadb.Response;
import dev.skyherobrine.authenticate.repositories.mariadb.*;
import dev.skyherobrine.authenticate.repositories.mariadb.*;
import dev.skyherobrine.authenticate.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

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
    private final KafkaTemplate<String, String> kafkaTemplate;

    public UserController(PatientRepository pr, DoctorRepository dr, DoctorCertificateRepository doctorCertificateRepository, DoctorEducationRepository doctorEducationRepository, DoctorExperienceRepository doctorExperienceRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.pr = pr;
        this.dr = dr;
        this.doctorCertificateRepository = doctorCertificateRepository;
        this.doctorEducationRepository = doctorEducationRepository;
        this.doctorExperienceRepository = doctorExperienceRepository;
        this.kafkaTemplate = kafkaTemplate;
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

    @PutMapping("/patient/{userId}")
    public ResponseEntity<Response> updatePatientInfo(@PathVariable("userId") String patientId, @RequestBody PatientRegisterDTO patientRegisterDTO) {
        try {
            log.info("User: Call api update the patient");
            Patient patient = pr.findPatientByUserId(patientId).orElse(null);
            if(patient != null) {
                log.info("User: send the message to kafka");
                Map<String,Object> dataSend = new HashMap<>() {
                    {
                        put("patientId", patientId);
                        put("data", patientRegisterDTO);
                    }
                };
                kafkaTemplate.send("update_patient_info", ObjectParser.convertObjectToJson(dataSend));

                patient.setFirstName(patientRegisterDTO.getFirstName());
                patient.setLastName(patientRegisterDTO.getLastName());
                patient.setPhone(patientRegisterDTO.getPhone());
                patient.setSex(patientRegisterDTO.getSex());
                patient.setDob(patientRegisterDTO.getDobLocalDate());
                patient.setEmail(patientRegisterDTO.getEmail());
                patient.setPassword(patientRegisterDTO.getPassword());

                Patient result = pr.save(patient);
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Update the patient successfully",
                        result
                ));
            }
            return ResponseEntity.ok(new Response(
                    HttpStatus.NOT_FOUND.value(),
                    "Can't find the patient",
                    null
            ));
        } catch (Exception e) {
            log.error("User: Can't update the patient");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The server can't update the patient",
                    e.getMessage()
            ));
        }
    }
}
