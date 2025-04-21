package dev.skyherobrine.authenticate.messages.consumers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.authenticate.enums.Diploma;
import dev.skyherobrine.authenticate.models.mariadb.*;
import dev.skyherobrine.authenticate.repositories.mariadb.*;
import dev.skyherobrine.authenticate.models.mariadb.*;
import dev.skyherobrine.authenticate.repositories.mariadb.*;
import dev.skyherobrine.authenticate.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
@Slf4j
public class DoctorConsumer {

    private final AddressRepository addressRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorCertificateRepository doctorCertificateRepository;
    private final DoctorEducationRepository doctorEducationRepository;
    private final DoctorExperienceRepository doctorExperienceRepository;

    public DoctorConsumer(AddressRepository addressRepository, DoctorRepository doctorRepository, DoctorCertificateRepository doctorCertificateRepository, DoctorEducationRepository doctorEducationRepository, DoctorExperienceRepository doctorExperienceRepository) {
        this.addressRepository = addressRepository;
        this.doctorRepository = doctorRepository;
        this.doctorCertificateRepository = doctorCertificateRepository;
        this.doctorEducationRepository = doctorEducationRepository;
        this.doctorExperienceRepository = doctorExperienceRepository;
    }

    @KafkaListener(topics = "insert_doctor", groupId = "authenticate_insert_doctor")
    public void insertDoctor(String message) {
        try {
            log.info("Doctor Consumer: listen insert doctor message");
            log.info("Doctor Consumer: {}", message);
            Doctor doctor = ObjectParser.convertJsonToObject(message, Doctor.class);
            doctorRepository.save(doctor);
            log.info("Doctor Consumer: insert doctor successfully");
        } catch (Exception e) {
            log.error("Doctor Consumer: insert doctor failed!");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "insert_doctor_certificate", groupId = "authenticate_insert_doctor_certificate")
    public void insertDoctorCertificate(String message) {
        try {
            log.info("Doctor Consumer: listen insert doctor certificate message");
            log.info("Doctor Consumer: {}", message);
            DoctorCertificate doctorCertificate = ObjectParser.convertJsonToObject(message, DoctorCertificate.class);
            doctorCertificateRepository.save(doctorCertificate);
            log.info("Doctor Consumer: insert doctor certificate successfully");
        } catch (Exception e) {
            log.error("Doctor Consumer: insert doctor certificate failed!");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "insert_doctor_education", groupId = "authenticate_insert_doctor_education")
    public void insertDoctorEducation(String message) {
        try {
            log.info("Doctor Consumer: listen insert doctor education message");
            log.info("Doctor Consumer: {}", message);
            DoctorEducation doctorEducation = ObjectParser.convertJsonToObject(message, DoctorEducation.class);
            doctorEducationRepository.save(doctorEducation);
            log.info("Doctor Consumer: insert doctor education successfully");
        } catch (Exception e) {
            log.error("Doctor Consumer: insert doctor education failed!");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "insert_doctor_experience", groupId = "authenticate_insert_doctor_experience")
    public void insertDoctorExperience(String message) {
        try {
            log.info("Doctor Consumer: listen insert doctor experience message");
            log.info("Doctor Consumer: {}", message);
            DoctorExperience doctorExperience = ObjectParser.convertJsonToObject(message, DoctorExperience.class);
            Address address = doctorExperience.getCompAddress();
            Address result = addressRepository.save(address);
            log.info("Doctor Consumer: insert address successfully");
            doctorExperience.setCompAddress(result);
            doctorExperienceRepository.save(doctorExperience);
            log.info("Doctor Consumer: insert doctor experience successfully");
        } catch (Exception e) {
            log.error("Doctor Consumer: insert doctor experience failed!");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "update_doctor_certificate", groupId = "authenticate_update_doctor_certificate")
    public void updateDoctorCertificate(String message) {
        try {
            log.info("Doctor Consumer: listen update doctor certificate message");
            log.info("Doctor Consumer: {}", message);

            JsonNode node = new ObjectMapper().readTree(message);
            String doctorId = node.get("doctorId").asText();
            Long certId = node.get("certId").asLong();
            JsonNode cert = node.get("cert");

            DoctorCertificate doctorCertificate = doctorCertificateRepository.findById(certId).orElse(null);
            if(doctorCertificate != null) {
                doctorCertificate.setCertName(cert.get("certName").asText());
                doctorCertificate.setIssueDate(LocalDate.parse(cert.get("issueDate").asText(), DateTimeFormatter.ofPattern("dd-MM-yyyy")));

                doctorCertificateRepository.save(doctorCertificate);
                log.info("Doctor Consumer: update doctor certificate successfully");
                return;
            }

            doctorCertificate = new DoctorCertificate(
                    doctorRepository.findDoctorByUserId(doctorId).orElseThrow(() -> new EntityNotFoundException("Doctor wasn't found!")),
                    cert.get("certName").asText(),
                    LocalDate.parse(cert.get("issueDate").asText(), DateTimeFormatter.ofPattern("dd-MM-yyyy"))
            );
            doctorCertificateRepository.save(doctorCertificate);
            log.info("Doctor Consumer: add doctor certificate successfully");
        } catch (Exception e) {
            log.error("Doctor Consumer: update doctor certificate failed!");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "update_doctor_education", groupId = "authenticate_update_doctor_education")
    public void updateDoctorEducation(String message) {
        try {
            log.info("Doctor Consumer: listen update or insert doctor education message");
            log.info("Doctor Consumer: {}", message);

            JsonNode node = new ObjectMapper().readTree(message);
            String doctorId = node.get("doctorId").asText();
            Long educationId = node.get("eduId").asLong();
            JsonNode education = node.get("education");

            DoctorEducation doctorEducation = doctorEducationRepository.findById(educationId).orElse(null);
            if(doctorEducation != null) {
                doctorEducation.setSchoolName(education.get("schoolName").asText());
                doctorEducation.setJoinDate(LocalDate.parse(education.get("joinDate").asText(), DateTimeFormatter.ofPattern("dd-MM-yyyy")));
                doctorEducation.setGraduateDate(LocalDate.parse(education.get("graduateDate").asText(), DateTimeFormatter.ofPattern("dd-MM-yyyy")));
                doctorEducation.setDiploma(Diploma.valueOf(education.get("diploma").asText()));

                doctorEducationRepository.save(doctorEducation);
                log.info("Doctor Consumer: update doctor education successfully");
                return;
            }

            doctorEducation = new DoctorEducation(
                    doctorRepository.findDoctorByUserId(doctorId).orElseThrow(() -> new EntityNotFoundException("Doctor wasn't found!")),
                    education.get("schoolName").asText(),
                    LocalDate.parse(education.get("joinDate").asText(), DateTimeFormatter.ofPattern("dd-MM-yyyy")),
                    LocalDate.parse(education.get("graduateDate").asText(), DateTimeFormatter.ofPattern("dd-MM-yyyy")),
                    Diploma.valueOf(education.get("diploma").asText())
            );
            doctorEducationRepository.save(doctorEducation);
            log.info("Doctor Consumer: add doctor education successfully");
        } catch (Exception e) {
            log.error("Doctor Consumer: update doctor education failed!");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "update_doctor_experience", groupId = "authenticate_update_doctor_experience")
    public void updateDoctorExperience(String message) {
        try {
            log.info("Doctor Consumer: listen update or insert doctor experience message");
            log.info("Doctor Consumer: {}", message);

            JsonNode node = new ObjectMapper().readTree(message);
            String doctorId = node.get("doctorId").asText();
            Long experienceId = node.get("experienceId").asLong();
            JsonNode experience = node.get("experience");

            DoctorExperience doctorExperience = doctorExperienceRepository.findById(experienceId).orElse(null);
            if(doctorExperience != null) {
                doctorExperience.setCompanyName(experience.get("companyName").asText());
                doctorExperience.setSpecialization(experience.get("specialization").asText());
                doctorExperience.setStartDate(LocalDate.parse(experience.get("startDate").asText(), DateTimeFormatter.ofPattern("dd-MM-yyyy")));
                doctorExperience.setEndDate(LocalDate.parse(experience.get("endDate").asText(), DateTimeFormatter.ofPattern("dd-MM-yyyy")));
                doctorExperience.setDescription(experience.get("description").asText());

                JsonNode address = experience.get("address");
                Address addressEntity = doctorExperience.getCompAddress();
                addressEntity.setNumber(address.get("number").asText());
                addressEntity.setStreet(address.get("street").asText());
                addressEntity.setWard(address.get("ward").asText());
                addressEntity.setDistrict(address.get("district").asText());
                addressEntity.setCity(address.get("city").asText());
                addressEntity.setCountry(address.get("country").asText());

                doctorExperience.setCompAddress(addressRepository.save(addressEntity));
                doctorExperienceRepository.save(doctorExperience);
                log.info("Doctor Consumer: update doctor experience successfully");
                return;
            }

            doctorExperience = new DoctorExperience(
                    doctorRepository.findDoctorByUserId(doctorId).orElseThrow(() -> new EntityNotFoundException("Doctor wasn't found!")),
                    experience.get("companyName").asText(),
                    experience.get("specialization").asText(),
                    LocalDate.parse(experience.get("startDate").asText(), DateTimeFormatter.ofPattern("dd-MM-yyyy")),
                    LocalDate.parse(experience.get("endDate").asText(), DateTimeFormatter.ofPattern("dd-MM-yyyy")),
                    addressRepository.save(new Address(
                            experience.get("address").get("number").asText(),
                            experience.get("address").get("street").asText(),
                            experience.get("address").get("ward").asText(),
                            experience.get("address").get("district").asText(),
                            experience.get("address").get("city").asText(),
                            experience.get("address").get("country").asText()
                    )),
                    experience.get("description").asText()
            );
            doctorExperienceRepository.save(doctorExperience);
            log.info("Doctor Consumer: add doctor experience successfully");
        } catch (Exception e) {
            log.error("Doctor Consumer: update doctor experience failed!");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "delete_doctor", groupId = "authenticate_delete_doctor")
    public void deleteDoctor(String message) {
        try {
            log.info("Doctor Consumer: listen delete doctor message");
            log.info("Doctor Consumer: {}", message);

            String doctorId = ObjectParser.convertJsonToObject(message, String.class);
            Doctor doctor = doctorRepository.findDoctorByUserId(doctorId).orElse(null);
            if(doctor != null) {
                doctor.setStatus(false);
                doctorRepository.save(doctor);
                log.info("Doctor Consumer: delete doctor successfully");
                return;
            }
            log.warn("Doctor Consumer: doctor not found!");
        } catch (Exception e) {
            log.error("Doctor Consumer: delete doctor failed!");
            log.error(e.getMessage());
        }
    }
}
