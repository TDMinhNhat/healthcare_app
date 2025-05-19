package dev.skyherobrine.appointment.services;

import com.fasterxml.jackson.databind.JsonNode;
import dev.skyherobrine.appointment.dtos.MedicalRecordDTO;
import dev.skyherobrine.appointment.feigns.WorkScheduleFeign;
import dev.skyherobrine.appointment.keys.MedicalRecordDrugKey;
import dev.skyherobrine.appointment.messages.consumers.responses.WorkScheduleResponseConsumer;
import dev.skyherobrine.appointment.models.mongodb.BookAppointment;
import dev.skyherobrine.appointment.models.mongodb.MedicalRecord;
import dev.skyherobrine.appointment.models.mongodb.MedicalRecordDrug;
import dev.skyherobrine.appointment.repositories.mariadb.DrugRepository;
import dev.skyherobrine.appointment.repositories.mongodb.BookAppointmentRepository;
import dev.skyherobrine.appointment.repositories.mongodb.MedicalRecordDrugRepository;
import dev.skyherobrine.appointment.repositories.mongodb.MedicalRecordRepository;
import dev.skyherobrine.appointment.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class MedicalRecordService {

    private final BookAppointmentRepository bookAppointmentRepository;
    private final DrugRepository drugRepository;
    private final MedicalRecordDrugRepository medicalRecordDrugRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final KafkaTemplate<String,String> kafkaTemplate;
    private final WorkScheduleFeign workScheduleFeign;
    private final WorkScheduleResponseConsumer workScheduleResponseConsumer;

    public MedicalRecordService(BookAppointmentRepository bookAppointmentRepository, DrugRepository drugRepository, MedicalRecordDrugRepository medicalRecordDrugRepository, MedicalRecordRepository medicalRecordRepository, KafkaTemplate<String, String> kafkaTemplate, WorkScheduleFeign workScheduleFeign, WorkScheduleResponseConsumer workScheduleResponseConsumer) {
        this.bookAppointmentRepository = bookAppointmentRepository;
        this.drugRepository = drugRepository;
        this.medicalRecordDrugRepository = medicalRecordDrugRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.workScheduleFeign = workScheduleFeign;
        this.workScheduleResponseConsumer = workScheduleResponseConsumer;
    }

    public MedicalRecord addMedicalRecord(MedicalRecordDTO medicalRecordDTO) throws Exception {
        log.info("Medical Record Service: add medical record");
        log.info("Medical Record Service: sending insert medical record message to kafka");
        kafkaTemplate.send("insert_medical_record", ObjectParser.convertObjectToJson(medicalRecordDTO));

        MedicalRecord medicalRecord = new MedicalRecord(
                getMaxId(),
                bookAppointmentRepository.findById(medicalRecordDTO.getBookAppointmentId()).orElseThrow(() -> new EntityNotFoundException("Medical Record Service: The book appointment was not found!")),
                medicalRecordDTO.getDiagnosisDisease(),
                medicalRecordDTO.getNote(),
                LocalDate.parse(medicalRecordDTO.getReExaminationDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")));

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

    public List<Map<String,Object>> getPreviousMedicalRecord(String patientId, String bookAppointmentId) {
        log.info("Medical Record Service: get previous medical record");
        List<Map<String,Object>> result = new ArrayList<>();

        medicalRecordRepository.findByBookAppointment_PatientIdAndBookAppointment_IdNot(patientId, Long.parseLong(bookAppointmentId)).forEach(item -> {
            Map<String,Object> data = new HashMap<>();
            data.put("medicalRecord", item);
            data.put("drugs", medicalRecordDrugRepository.findById_MedicalRecord_Id(item.getId()));
            data.put("doctor", workScheduleFeign.getById(item.getBookAppointment().getWorkSchedule()).getBody().getData());
            result.add(data);
        });

        return result;
    }

    public List<Map<String,Object>> getAllMedicalRecords(String userId) throws Exception {
        log.info("Medical Record Service: Get all medical records");
        List<Map<String,Object>> result = new ArrayList<>();
        List<MedicalRecord> medicalRecords = medicalRecordRepository.findByBookAppointment_PatientId(userId);
        List<Long> workSchedules = medicalRecords.stream().map(MedicalRecord::getBookAppointment).map(BookAppointment::getWorkSchedule).toList();

        kafkaTemplate.send("request_get_list_work_schedule_order", ObjectParser.convertObjectToJson(workSchedules));

        JsonNode node = workScheduleResponseConsumer.getStorageData();
        node.forEach(item -> {
            Map<String,Object> data = new HashMap<>();
            data.put("workSchedule", item);
            data.put("medicalRecord", medicalRecords.stream().filter(medicalRecord -> medicalRecord.getBookAppointment().getWorkSchedule().equals(item.get("id").asLong())));
            data.put("drugs", medicalRecordDrugRepository.findById_MedicalRecord_Id(
                    medicalRecords.stream().filter(medicalRecord -> medicalRecord.getBookAppointment().getWorkSchedule().equals(item.get("id").asLong())).map(MedicalRecord::getId).toList().getFirst()
            ));
            result.add(data);
        });
        return result;
    }

    private Long getMaxId() {
        return (medicalRecordRepository.findTopByOrderByIdDesc().map(MedicalRecord::getId).orElse(0L)) + 1;
    }
}
