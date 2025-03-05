package dev.skyherobrine.service.messages.consumes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.service.keys.MedicalRecordDrugKey;
import dev.skyherobrine.service.models.mongodb.Appointment;
import dev.skyherobrine.service.models.mariadb.Drug;
import dev.skyherobrine.service.models.mongodb.MedicalRecord;
import dev.skyherobrine.service.models.mongodb.MedicalRecordDrug;
import dev.skyherobrine.service.repositories.mongodb.AppointmentRepository;
import dev.skyherobrine.service.repositories.mariadb.DrugRepository;
import dev.skyherobrine.service.repositories.mongodb.MedicalRecordDrugRepository;
import dev.skyherobrine.service.repositories.mongodb.MedicalRecordRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
@Slf4j
public class MedicalRecordConsumer {

    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicalRecordDrugRepository medicalRecordDrugRepository;
    private final DrugRepository drugRepository;

    public MedicalRecordConsumer(AppointmentRepository appointmentRepository, MedicalRecordRepository medicalRecordRepository, MedicalRecordDrugRepository medicalRecordDrugRepository, DrugRepository drugRepository) {
        this.appointmentRepository = appointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.medicalRecordDrugRepository = medicalRecordDrugRepository;
        this.drugRepository = drugRepository;
    }

    @KafkaListener(topics = "insert_medical_record", groupId = "admin_insert_medical_record")
    public void insertMedicalRecord(String message) {
        try {
            log.info("Medical Record Consumer: listening insert medical record message");
            log.info("Medical Record Consumer: {}", message);

            JsonNode node = new ObjectMapper().readTree(message);
            Appointment appointment = appointmentRepository.findAppointmentByRoomId(node.get("roomId").asText()).orElseThrow(() -> new EntityNotFoundException("Appointment not found"));
            String getDiagnosisDisease = node.get("diagnosisDisease").asText();
            String getNote = node.get("note").asText();
            String getReExaminationDate = node.get("reExaminationDate").asText();

            MedicalRecord medicalRecord = new MedicalRecord(appointment, getDiagnosisDisease, getNote, LocalDate.parse(getReExaminationDate, DateTimeFormatter.ofPattern("dd-MM-yyyy")));
            medicalRecordRepository.save(medicalRecord);
            log.info("Medical Record Consumer: inserted medical record into database");
        } catch (Exception e) {
            log.error("Medical Record Consumer: can't insert medical record into database");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "insert_medical_record_drug", groupId = "admin_insert_medical_record_drug")
    public void insertMedicalRecordDrug(String message) {
        try {
            log.info("Medical Record Consumer: listening insert medical record drug message");
            log.info("Medical Record Consumer: {}", message);

            JsonNode node = new ObjectMapper().readTree(message);
            MedicalRecord medicalRecord = medicalRecordRepository.findById(node.get("medicalRecordId").asLong()).orElseThrow(() -> new EntityNotFoundException("Medical Record not found"));
            Drug drug = drugRepository.findById(node.get("medicalRecordDrug").get("drugId").asLong()).orElseThrow(() -> new EntityNotFoundException("Drug not found"));
            Double getQuantity = node.get("medicalRecordDrug").get("quantity").asDouble();
            String getHowUse = node.get("medicalRecordDrug").get("howUse").asText();

            MedicalRecordDrug medicalRecordDrug = new MedicalRecordDrug(new MedicalRecordDrugKey(medicalRecord, drug), getQuantity, getHowUse);
            medicalRecordDrugRepository.save(medicalRecordDrug);
            log.info("Medical Record Consumer: inserted medical record drug into database");
        } catch (Exception e) {
            log.error("Medical Record Consumer: can't insert medical record drug into database");
            log.error(e.getMessage());
        }
    }
}
