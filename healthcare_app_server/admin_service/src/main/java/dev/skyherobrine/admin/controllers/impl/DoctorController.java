package dev.skyherobrine.admin.controllers.impl;

import dev.skyherobrine.admin.controllers.IManagement;
import dev.skyherobrine.admin.dtos.DoctorDTO;
import dev.skyherobrine.admin.models.mariadb.*;
import dev.skyherobrine.admin.repositories.mariadb.*;
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
    private final AddressRepository addressRepository;

    public DoctorController(DoctorRepository doctorRepository, DoctorService doctorService, DoctorCertificateRepository doctorCertificateRepository, DoctorEducationRepository doctorEducationRepository, DoctorExperienceRepository doctorExperienceRepository, KafkaTemplate<String, String> kafkaTemplate, AddressRepository addressRepository) {
        this.doctorRepository = doctorRepository;
        this.doctorService = doctorService;
        this.doctorCertificateRepository = doctorCertificateRepository;
        this.doctorEducationRepository = doctorEducationRepository;
        this.doctorExperienceRepository = doctorExperienceRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.addressRepository = addressRepository;
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

    @PutMapping("/certification/update/{doctorId}/{certificateId}")
    public ResponseEntity<Response> updateDoctorCertificate(
            @PathVariable("doctorId") String doctorId,
            @PathVariable(name = "certificateId", required = false) Long certId,
            @RequestBody DoctorDTO.DoctorCertificateDTO cert
    ) {
        try {
            log.info("Doctor: Call the api update doctor certification");
            Map<String,Object> dataSend = new HashMap<>() {{
                put("doctorId", doctorId);
                put("certId", certId);
                put("cert", cert);
            }};
            kafkaTemplate.send("update_doctor_certificate", ObjectParser.convertObjectToJson(dataSend));

            DoctorCertificate doctorCertificate = doctorCertificateRepository.findById(certId).orElse(null);
            if(doctorCertificate != null) {
                doctorCertificate.setCertName(cert.getCertName());
                doctorCertificate.setIssueDate(LocalDate.parse(cert.getIssueDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")));

                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Update doctor certificate",
                        doctorCertificateRepository.save(doctorCertificate)
                ));
            }

            doctorCertificate = new DoctorCertificate(
                    doctorRepository.findDoctorByUserId(doctorId).orElseThrow(() -> new EntityNotFoundException("Doctor wasn't found!")),
                    cert.getCertName(),
                    LocalDate.parse(cert.getIssueDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy"))
            );

            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Add doctor certificate",
                    doctorCertificateRepository.save(doctorCertificate)
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

    @PutMapping("/education/update/{doctorId}/{educationId}")
    public ResponseEntity<Response> updateDoctorEducation(
            @PathVariable("doctorId") String doctorId,
            @PathVariable(value = "educationId", required = false) Long educationId,
            @RequestBody DoctorDTO.DoctorEducationDTO education
    ) {
        try {
            log.info("Doctor: Call the api update doctor education");
            Map<String,Object> dataSend = new HashMap<>() {{
                put("doctorId", doctorId);
                put("educationId", educationId);
                put("education", education);
            }};
            kafkaTemplate.send("update_doctor_education", ObjectParser.convertObjectToJson(dataSend));

            DoctorEducation doctorEducation = doctorEducationRepository.findById(educationId).orElse(null);
            if(doctorEducation != null) {
                doctorEducation.setSchoolName(education.getSchoolName());
                doctorEducation.setJoinDate(LocalDate.parse(education.getJoinDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")));
                doctorEducation.setGraduateDate(LocalDate.parse(education.getGraduateDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")));
                doctorEducation.setDiploma(education.getDiploma());
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Update doctor education",
                        doctorEducationRepository.save(doctorEducation)
                ));
            }

            doctorEducation = new DoctorEducation(
                    doctorRepository.findDoctorByUserId(doctorId).orElseThrow(() -> new EntityNotFoundException("Doctor wasn't found!")),
                    education.getSchoolName(),
                    LocalDate.parse(education.getJoinDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")),
                    LocalDate.parse(education.getGraduateDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")),
                    education.getDiploma()
            );
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Add doctor education",
                    doctorEducationRepository.save(doctorEducation)
            ));

        } catch (Exception e) {
            log.error("Doctor: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api update doctor education return an error",
                    e.getMessage()
            ));
        }
    }

    @PutMapping("/experience/update/{doctorId}/{experienceId}")
    public ResponseEntity<Response> updateDoctorExperience(
            @PathVariable("doctorId") String doctorId,
            @PathVariable(value = "experienceId", required = false) Long experienceId,
            @RequestBody DoctorDTO.DoctorExperienceDTO experience
    ) {
        try {
            log.info("Doctor: Call the api update doctor experience");
            Map<String,Object> dataSend = new HashMap<>() {{
                put("doctorId", doctorId);
                put("experienceId", experienceId);
                put("experience", experience);
            }};
            kafkaTemplate.send("update_doctor_experience", ObjectParser.convertObjectToJson(dataSend));

            DoctorExperience doctorExperience = doctorExperienceRepository.findById(experienceId).orElse(null);
            if(doctorExperience != null) {
                doctorExperience.setCompanyName(experience.getCompanyName());
                doctorExperience.setSpecialization(experience.getSpecialization());
                doctorExperience.setStartDate(LocalDate.parse(experience.getStartDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")));
                doctorExperience.setEndDate(LocalDate.parse(experience.getEndDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")));
                doctorExperience.setDescription(experience.getDescription());

                Address address = doctorExperience.getCompAddress();
                address.setNumber(experience.getAddress().getNumber());
                address.setStreet(experience.getAddress().getStreet());
                address.setWard(experience.getAddress().getWard());
                address.setDistrict(experience.getAddress().getDistrict());
                address.setCity(experience.getAddress().getCity());
                address.setCountry(experience.getAddress().getCountry());
                Address result = addressRepository.save(address);
                doctorExperience.setCompAddress(result);

                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Update doctor experience",
                        doctorExperienceRepository.save(doctorExperience)
                ));
            }

            Address address = new Address(
                    experience.getAddress().getNumber(),
                    experience.getAddress().getStreet(),
                    experience.getAddress().getWard(),
                    experience.getAddress().getDistrict(),
                    experience.getAddress().getCity(),
                    experience.getAddress().getCountry()
            );
            doctorExperience = new DoctorExperience(
                    doctorRepository.findDoctorByUserId(doctorId).orElseThrow(() -> new EntityNotFoundException("Doctor wasn't found!")),
                    experience.getCompanyName(),
                    experience.getSpecialization(),
                    LocalDate.parse(experience.getStartDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")),
                    LocalDate.parse(experience.getEndDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")),
                    addressRepository.save(address),
                    experience.getDescription()
            );
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Add doctor experience",
                    doctorExperienceRepository.save(doctorExperience)
            ));
        } catch (Exception e) {
            log.error("Doctor: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api update doctor experience return an error",
                    e.getMessage()
            ));
        }
    }
}
