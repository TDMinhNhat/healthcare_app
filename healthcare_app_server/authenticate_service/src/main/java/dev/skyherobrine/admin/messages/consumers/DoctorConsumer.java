package dev.skyherobrine.admin.messages.consumers;

import dev.skyherobrine.admin.models.mariadb.*;
import dev.skyherobrine.admin.repositories.mariadb.*;
import dev.skyherobrine.admin.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

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
}
