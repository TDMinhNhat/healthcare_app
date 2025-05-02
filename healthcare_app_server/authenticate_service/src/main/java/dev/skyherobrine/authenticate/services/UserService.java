package dev.skyherobrine.authenticate.services;

import dev.skyherobrine.authenticate.dtos.PatientRegisterDTO;
import dev.skyherobrine.authenticate.models.mariadb.Patient;
import dev.skyherobrine.authenticate.repositories.mariadb.PatientRepository;
import dev.skyherobrine.authenticate.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class UserService {

    private final PatientRepository patientRepository;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public UserService(PatientRepository patientRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.patientRepository = patientRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public Patient updatePatientInfo(String patientId, PatientRegisterDTO patientRegisterDTO) throws Exception {
        log.info("User Service: update patient information");
        Patient patient = patientRepository.findPatientByUserId(patientId).orElse(null);
        if(patient != null) {
            log.info("User Service: send the message to kafka");
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

            return patientRepository.save(patient);
        }
        return null;
    }
}
