package dev.skyherobrine.appointment.services;

import dev.skyherobrine.appointment.dtos.MedicalRecordDTO;
import dev.skyherobrine.appointment.keys.MedicalRecordDrugKey;
import dev.skyherobrine.appointment.models.mongodb.Appointment;
import dev.skyherobrine.appointment.models.mongodb.MedicalRecord;
import dev.skyherobrine.appointment.models.mongodb.MedicalRecordDrug;
import dev.skyherobrine.appointment.repositories.mongodb.AppointmentRepository;
import dev.skyherobrine.appointment.repositories.mariadb.DrugRepository;
import dev.skyherobrine.appointment.repositories.mongodb.MedicalRecordDrugRepository;
import dev.skyherobrine.appointment.repositories.mongodb.MedicalRecordRepository;
import dev.skyherobrine.appointment.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class MedicalRecordService {

    private final DrugRepository drugRepository;
    private final MedicalRecordDrugRepository medicalRecordDrugRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public MedicalRecordService(DrugRepository drugRepository, MedicalRecordDrugRepository medicalRecordDrugRepository, AppointmentRepository appointmentRepository, MedicalRecordRepository medicalRecordRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.drugRepository = drugRepository;
        this.medicalRecordDrugRepository = medicalRecordDrugRepository;
        this.appointmentRepository = appointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public MedicalRecord addMedicalRecord(MedicalRecordDTO medicalRecordDTO) throws Exception {
        log.info("Medical Record Service: add medical record");
        log.info("Medical Record Service: sending insert medical record message to kafka");
        kafkaTemplate.send("insert_medical_record", ObjectParser.convertObjectToJson(medicalRecordDTO));

        Appointment appointment = appointmentRepository.findAppointmentByRoomId(medicalRecordDTO.getRoomId()).orElseThrow(() -> new EntityNotFoundException("Appointment not found!"));
        MedicalRecord medicalRecord = new MedicalRecord(
                appointment,
                medicalRecordDTO.getDiagnosisDisease(),
                LocalDate.parse(medicalRecordDTO.getReExaminationDate(),
                        DateTimeFormatter.ofPattern("dd-MM-yyyy")));
        medicalRecord.setId(getMaxId() + 1);
        MedicalRecord target = medicalRecordRepository.save(medicalRecord);
        log.info("Medical Record Service: medical record saved into database");

        Thread.sleep(1000);

        log.info("Medical Record Service: sending insert medical record drug message to kafka");
        for(MedicalRecordDTO.MedicalRecordDrugDTO item : medicalRecordDTO.getDrugs()) {
            Map<String,Object> data = new HashMap<>();
            data.put("medicalRecordId", target.getId());
            data.put("medicalRecordDrug", item);
            kafkaTemplate.send("insert_medical_record_drug", ObjectParser.convertObjectToJson(data));

            MedicalRecordDrug medicalRecordDrug = new MedicalRecordDrug(
                    new MedicalRecordDrugKey(target, drugRepository.findById(item.getDrugId()).orElseThrow(() -> new EntityNotFoundException("Drug not found!"))),
                    item.getQuantity(),
                    item.getHowUse()
            );
            medicalRecordDrugRepository.save(medicalRecordDrug);
        }
        log.info("Medical Record Service: medical record drugs saved into database");
        return target;
    }

    private Long getMaxId() {
        return medicalRecordRepository.findTopByOrderByIdDesc().map(MedicalRecord::getId).orElse(0L);
    }
}
