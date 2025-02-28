package dev.skyherobrine.service.services;

import dev.skyherobrine.service.dtos.DoctorDTO;
import dev.skyherobrine.service.models.mariadb.*;
import dev.skyherobrine.service.repositories.mariadb.*;
import dev.skyherobrine.service.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

@Service
@Slf4j
public class DoctorService {

    private final AddressRepository addressRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorCertificateRepository doctorCertificateRepository;
    private final DoctorEducationRepository doctorEducationRepository;
    private final DoctorExperienceRepository doctorExperienceRepository;
    private final AuthenticateProviderRepository authenticateProviderRepository;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public DoctorService(AddressRepository addressRepository, DoctorRepository doctorRepository, DoctorCertificateRepository doctorCertificateRepository, DoctorEducationRepository doctorEducationRepository, DoctorExperienceRepository doctorExperienceRepository, AuthenticateProviderRepository authenticateProviderRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.addressRepository = addressRepository;
        this.doctorRepository = doctorRepository;
        this.doctorCertificateRepository = doctorCertificateRepository;
        this.doctorEducationRepository = doctorEducationRepository;
        this.doctorExperienceRepository = doctorExperienceRepository;
        this.authenticateProviderRepository = authenticateProviderRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public Doctor addDoctor(DoctorDTO doctorDTO) throws Exception {
        log.info("Doctor Service: add doctor");
        Doctor target = doctorDTO.toObject();

        String getUserId = generateUserId(target.getDob());
        log.info("Doctor Service: generated user id is {}", getUserId);
        target.setUserId(getUserId);
        target.setAuthedProvider(authenticateProviderRepository.findByAuthenName("APPLICATION").orElseThrow(() -> new EntityNotFoundException("Authenticate Provider not found")));

        log.info("Doctor Service: sending insert doctor message to kafka");
        kafkaTemplate.send("insert_doctor", ObjectParser.convertObjectToJson(target));
        log.info("Doctor Service: saving doctor into database");
        Doctor doctor = doctorRepository.save(target);

        log.info("Doctor Service: sending insert doctor certificate message to kafka");
        for(DoctorCertificate doctorCertificate : doctorDTO.certificates(doctor)) {
            kafkaTemplate.send("insert_doctor_certificate", ObjectParser.convertObjectToJson(doctorCertificate));
        }
        log.info("Doctor Service: saving doctor certificates into database");
        doctorCertificateRepository.saveAll(doctorDTO.certificates(doctor));

        log.info("Doctor Service: sending insert doctor education message to kafka");
        for(DoctorEducation doctorEducation : doctorDTO.educations(doctor)) {
            kafkaTemplate.send("insert_doctor_education", ObjectParser.convertObjectToJson(doctorEducation));
        }
        log.info("Doctor Service: saving doctor educations into database");
        doctorEducationRepository.saveAll(doctorDTO.educations(doctor));

        log.info("Doctor Service: sending insert doctor experience message to kafka");
        for(DoctorExperience doctorExperience : doctorDTO.experiences(doctor)) {
            Address getAddress = doctorExperience.getCompAddress();
            addressRepository.save(getAddress);
            kafkaTemplate.send("insert_doctor_experience", ObjectParser.convertObjectToJson(doctorExperience));
        }
        log.info("Doctor Service: saving doctor experiences into database");
        doctorExperienceRepository.saveAll(doctorDTO.experiences(doctor));
        return doctor;
    }

    private String generateUserId(LocalDate dob) {
        String getTimeFormat = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + "-";
        String getRandomNumber = ThreadLocalRandom.current().nextInt(11111, 99999) + "-";
        String getDateFormat = dob.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return getTimeFormat + getRandomNumber + getDateFormat;
    }
}
