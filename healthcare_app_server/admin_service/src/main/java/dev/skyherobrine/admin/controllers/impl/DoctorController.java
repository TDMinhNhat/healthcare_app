package dev.skyherobrine.admin.controllers.impl;

import dev.skyherobrine.admin.controllers.IManagement;
import dev.skyherobrine.admin.dtos.DoctorDTO;
import dev.skyherobrine.admin.models.mariadb.Doctor;
import dev.skyherobrine.admin.models.mariadb.DoctorCertificate;
import dev.skyherobrine.admin.models.mariadb.Response;
import dev.skyherobrine.admin.repositories.mariadb.DoctorCertificateRepository;
import dev.skyherobrine.admin.repositories.mariadb.DoctorEducationRepository;
import dev.skyherobrine.admin.repositories.mariadb.DoctorExperienceRepository;
import dev.skyherobrine.admin.repositories.mariadb.DoctorRepository;
import dev.skyherobrine.admin.services.DoctorService;
import dev.skyherobrine.admin.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/v1/doctors")
@Slf4j
public class DoctorController implements IManagement<DoctorDTO, Long> {

    private final DoctorRepository doctorRepository;
    private final DoctorService doctorService;
    private final DoctorCertificateRepository doctorCertificateRepository;
    private final DoctorEducationRepository doctorEducationRepository;
    private final DoctorExperienceRepository doctorExperienceRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public DoctorController(DoctorRepository doctorRepository, DoctorService doctorService, DoctorCertificateRepository doctorCertificateRepository, DoctorEducationRepository doctorEducationRepository, DoctorExperienceRepository doctorExperienceRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.doctorRepository = doctorRepository;
        this.doctorService = doctorService;
        this.doctorCertificateRepository = doctorCertificateRepository;
        this.doctorEducationRepository = doctorEducationRepository;
        this.doctorExperienceRepository = doctorExperienceRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @GetMapping
    @Override
    public ResponseEntity<Response> getAll() {
        log.info("Doctor: Call the api get all doctors");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all doctors successfully",
                doctorRepository.findAll()
        ));
    }

    @Override
    public ResponseEntity<Response> getById(Long aLong) {
        return null;
    }

    @PostMapping
    @Override
    public ResponseEntity<Response> add(@RequestBody DoctorDTO doctorDTO) {
        try {
            log.info("Doctor: Call the api insert doctor");
            Doctor target = doctorService.addDoctor(doctorDTO);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Insert doctor successfully",
                    target
            ));
        } catch (Exception e) {
            log.error("Doctor: insert doctor failed");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Insert doctor failed",
                    null
            ));
        }
    }

    @Override
    public ResponseEntity<Response> update(Long aLong, DoctorDTO doctorDTO) {
        return null;
    }

    @Override
    public ResponseEntity<Response> delete(Long aLong) {
        return null;
    }

    @PostMapping("/doctor_not_in_list")
    public ResponseEntity<Response> getDoctorNotInList(@RequestBody List<String> listDoctorId) {
        log.info("Doctor: Call the api get doctors not in list");
        List<Doctor> result = doctorRepository.findAll().stream().filter(doctor -> !listDoctorId.contains(doctor.getUserId())).toList();
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get doctors not in list successfully",
                result
        ));
    }

    @GetMapping("/userId")
    public ResponseEntity<Response> getDoctorByUserId(@RequestParam("userId") String userId) {
        try {
            log.info("Doctor: Call the api get doctor by user id");
            Doctor doctor = doctorRepository.findDoctorByUserId(userId).orElse(null);
            if(doctor != null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Get doctor by user id successfully",
                        doctor
                ));
            }
            return ResponseEntity.ok(new Response(
                    HttpStatus.NOT_FOUND.value(),
                    "There are no any doctor for this user id",
                    null
            ));
        } catch (Exception e) {
            log.error("Doctor: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api get doctor by user id return an error",
                    e.getMessage()
            ));
        }
    }

    @PostMapping("/import")
    public ResponseEntity<Response> importDoctor(@RequestBody List<DoctorDTO> doctors) {
        try {
            log.info("Doctor: Call the api import doctor base info");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Import doctor base info successfully",
                    doctors.stream().map(item -> {
                        try {
                            return doctorService.addDoctor(item);
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    }).toList()
            ));
        } catch (Exception e) {
            log.error("Doctor: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api import doctor base info return an error",
                    e.getMessage()
            ));
        }
    }

    @PostMapping("/certification/{doctorId}")
    public ResponseEntity<Response> addCertification(
            @PathVariable("doctorId") String doctorId,
            @RequestBody List<DoctorDTO.DoctorCertificateDTO> certs
     ) {
        try {
            log.info("Doctor: Call the api add doctor certification");
            for(DoctorDTO.DoctorCertificateDTO cert : certs) {
                DoctorCertificate doctorCertificate = new DoctorCertificate(
                        doctorRepository.findDoctorByUserId(doctorId).orElseThrow(() -> new EntityNotFoundException("The doctor wasn't found!")),
                        cert.getCertName(),
                        LocalDate.parse(cert.getIssueDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy"))
                );
                kafkaTemplate.send("insert_doctor_certificate", ObjectParser.convertObjectToJson(doctorCertificate));
                doctorCertificateRepository.save(doctorCertificate);
            }

            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Add doctor certification successfully",
                    true
            ));
        } catch (Exception e) {
            log.error("Doctor: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api add doctor certification return an error",
                    e.getMessage()
            ));
        }
    }

    @PutMapping("/certification/update/{id}")
    public ResponseEntity<Response> updateDoctorCertificate(
            @PathVariable("id") Long id,
            @RequestBody DoctorDTO.DoctorCertificateDTO cert
    ) {
        try {
            log.info("Doctor: Call the api update doctor certification");
            DoctorCertificate doctorCertificate = doctorCertificateRepository.findById(id).orElse(null);
            if(doctorCertificate != null) {
                doctorCertificate.setCertName(cert.getCertName());
                doctorCertificate.setIssueDate(LocalDate.parse(cert.getIssueDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")));

                Map<String,Object> dataSend = new HashMap<>() {{
                    put("id", id);
                    put("cert", cert);
                }};
                kafkaTemplate.send("update_doctor_certificate", ObjectParser.convertObjectToJson(dataSend));

                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Update doctor certificate successfully",
                        doctorCertificateRepository.save(doctorCertificate)
                ));
            }
            return ResponseEntity.ok(new Response(
                    HttpStatus.NOT_FOUND.value(),
                    "The doctor certificate wasn't found",
                    null
            ));
        } catch (Exception e) {
            log.error("Doctor: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api update doctor certification return an error",
                    e.getMessage()
            ));
        }
    }

    @PostMapping("/education/{doctorId}")
    public ResponseEntity<Response> addDoctorEducation() {
        return null;
    }

    @PutMapping("/education/update/{id}")
    public ResponseEntity<Response> updateDoctorEducation() {
        return null;
    }

    @PostMapping("/experience/{doctorId}")
    public ResponseEntity<Response> addDoctorExperience() {
        return null;
    }

    @PutMapping("/experience/update/{id}")
    public ResponseEntity<Response> updateDoctorExperience() {
        return null;
    }
}
