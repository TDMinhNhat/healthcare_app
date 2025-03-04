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
    private final PatientFaceEncodeRepository patientFaceEncodeRepository;
    private final TypeDiseaseRepository typeDiseaseRepository;
    private final WorkScheduleRepository workScheduleRepository;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public DoctorService(AddressRepository addressRepository, DoctorRepository doctorRepository, DoctorCertificateRepository doctorCertificateRepository, DoctorEducationRepository doctorEducationRepository, DoctorExperienceRepository doctorExperienceRepository, AuthenticateProviderRepository authenticateProviderRepository, PatientFaceEncodeRepository patientFaceEncodeRepository, TypeDiseaseRepository typeDiseaseRepository, WorkScheduleRepository workScheduleRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.addressRepository = addressRepository;
        this.doctorRepository = doctorRepository;
        this.doctorCertificateRepository = doctorCertificateRepository;
        this.doctorEducationRepository = doctorEducationRepository;
        this.doctorExperienceRepository = doctorExperienceRepository;
        this.authenticateProviderRepository = authenticateProviderRepository;
        this.patientFaceEncodeRepository = patientFaceEncodeRepository;
        this.typeDiseaseRepository = typeDiseaseRepository;
        this.workScheduleRepository = workScheduleRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public Doctor addDoctor(DoctorDTO doctorDTO) throws Exception {
        log.info("Doctor Service: add doctor");
        TypeDisease typeDisease = typeDiseaseRepository.findByName(doctorDTO.getTypeDisease()).orElseThrow(() -> new EntityNotFoundException("Type Disease wasn't found!"));

        String getUserId = generateUserId(LocalDate.parse(doctorDTO.getDob(), DateTimeFormatter.ofPattern("dd-MM-yyyy")));
        log.info("Doctor Service: generated user id is {}", getUserId);
        AuthenticateProvider authenticateProvider = authenticateProviderRepository.findByAuthenName("APPLICATION").orElseThrow(() -> new EntityNotFoundException("Authenticate Provider not found"));
        Doctor target = new Doctor(
                getUserId,
                doctorDTO.getFirstName(),
                doctorDTO.getLastName(),
                doctorDTO.getSex(),
                LocalDate.parse(doctorDTO.getDob(), DateTimeFormatter.ofPattern("dd-MM-yyyy")),
                doctorDTO.getPhone(),
                doctorDTO.getEmail(),
                doctorDTO.getPassword(),
                authenticateProvider,
                doctorDTO.getSpecialization(),
                typeDisease
        );

        log.info("Doctor Service: sending insert doctor message to kafka");
        kafkaTemplate.send("insert_doctor", ObjectParser.convertObjectToJson(target));
        log.info("Doctor Service: saving doctor into database");
        Doctor doctor = doctorRepository.save(target);

        Thread.sleep(2000);

        log.info("Doctor Service: sending insert doctor certificate message to kafka");
        for(DoctorCertificate doctorCertificate : doctorDTO.certificates(doctor)) {
            kafkaTemplate.send("insert_doctor_certificate", ObjectParser.convertObjectToJson(doctorCertificate));
            doctorCertificateRepository.save(doctorCertificate);
        }
        log.info("Doctor Service: saving doctor certificates into database");

        Thread.sleep(2000);

        log.info("Doctor Service: sending insert doctor education message to kafka");
        for(DoctorEducation doctorEducation : doctorDTO.educations(doctor)) {
            kafkaTemplate.send("insert_doctor_education", ObjectParser.convertObjectToJson(doctorEducation));
            doctorEducationRepository.save(doctorEducation);
        }
        log.info("Doctor Service: saving doctor educations into database");

        Thread.sleep(2000);

        log.info("Doctor Service: sending insert doctor experience message to kafka");
        for(DoctorExperience doctorExperience : doctorDTO.experiences(doctor)) {
            kafkaTemplate.send("insert_doctor_experience", ObjectParser.convertObjectToJson(doctorExperience));
            Address getAddress = doctorExperience.getCompAddress();
            Address addressResult = addressRepository.save(getAddress);
            Address address = addressRepository.findByid(addressResult.getId());
            doctorExperience.setCompAddress(address);
            doctorExperienceRepository.save(doctorExperience);
        }
        log.info("Doctor Service: saving doctor experiences into database");

        return doctor;
    }

    private String generateUserId(LocalDate dob) {
        String getTimeFormat = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + "-";
        String getRandomNumber = ThreadLocalRandom.current().nextInt(11111, 99999) + "-";
        String getDateFormat = dob.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return getTimeFormat + getRandomNumber + getDateFormat;
    }
}
