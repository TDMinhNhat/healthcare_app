package dev.skyherobrine.admin.services;

import dev.skyherobrine.admin.dtos.PatientRegisterDTO;
import dev.skyherobrine.admin.models.mariadb.Patient;
import dev.skyherobrine.admin.models.mariadb.User;
import dev.skyherobrine.admin.repositories.mariadb.AuthenticateProviderRepository;
import dev.skyherobrine.admin.repositories.mariadb.DoctorRepository;
import dev.skyherobrine.admin.repositories.mariadb.PatientRepository;
import dev.skyherobrine.admin.utils.ObjectParser;
import dev.skyherobrine.admin.utils.SendMailUtil;
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
public class AuthenticateService {

    private final PatientRepository pr;
    private final DoctorRepository dr;
    private final SendMailUtil sendMail;
    private final AuthenticateProviderRepository apr;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public AuthenticateService(PatientRepository pr, DoctorRepository dr, SendMailUtil sendMail, AuthenticateProviderRepository apr, KafkaTemplate<String, String> kafkaTemplate) {
        this.pr = pr;
        this.dr = dr;
        this.sendMail = sendMail;
        this.apr = apr;
        this.kafkaTemplate = kafkaTemplate;
    }

    public User checkLogin(String email, String password) {
        log.info("Authenticate Service: checking login...!");
        // Check the patient
        User patient = pr.findByEmailAndPassword(email, password).orElse(null);

        if(patient != null) {
            log.info("Authenticate Service: Found the patient");
            return patient;
        }
        log.info("Authenticate Service: Not a patient. Checking the doctor account...!");

        // Check the doctor
        User doctor = dr.findByEmailAndPassword(email, password).orElse(null);
        if(doctor != null) {
            log.info("Authenticate Service: Found the doctor");
            return doctor;
        }

        log.warn("Authenticate Service: Nobody found with those email and password");
        return null;
    }

    public User registerAccount(PatientRegisterDTO patientRegisterDTO) {
        try {
            log.info("Authenticate Service: running create a new account for the patient");

            Patient target = patientRegisterDTO.toObject();
            target.setUserId(generateUserId(patientRegisterDTO.getDobLocalDate()));
            target.setAuthedProvider(apr.findByAuthenName("APPLICATION").orElseThrow(() -> new EntityNotFoundException("Can't found the APPLICATION authenticate provider")));

            log.info("Authenticate Service: sending the message to kafka");
            kafkaTemplate.send("insert_patient", ObjectParser.convertObjectToJson(target));

            Patient result = pr.save(target);
            log.info("Authenticate Service: Account created successfully");
            return result;
        } catch (Exception e) {
            log.error("Authenticate Service: Create account failed");
            log.error(e.getMessage());
            return null;
        }
    }

    public boolean resetPassword(String email) {
        String newPassword = ThreadLocalRandom.current().nextInt(11111111,99999999) + "";
        int result = pr.updatePassword(newPassword, email);
        if(result == 1) {
            log.info("Authenticate Service: Reset password successfully");
            sendMail.sendSimpleMessage(email, "Reset password", "Your new password is: " + newPassword);
            return true;
        } else if(result == 0) {
            log.warn("Authenticate Service: Can't found the user with that email");
        } else {
            log.warn("Authenticate Service: Found the multiple users with that email");
        }
        return false;
    }

    private String generateUserId(LocalDate dob) {
        String getTimeFormat = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + "-";
        String getRandomNumber = ThreadLocalRandom.current().nextInt(11111, 99999) + "-";
        String getDateFormat = dob.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return getTimeFormat + getRandomNumber + getDateFormat;
    }
}
