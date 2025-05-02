package dev.skyherobrine.appointment.controllers;

import dev.skyherobrine.appointment.dtos.MedicalRecordDTO;
import dev.skyherobrine.appointment.feigns.WorkScheduleFeign;
import dev.skyherobrine.appointment.models.mongodb.MedicalRecord;
import dev.skyherobrine.appointment.models.Response;
import dev.skyherobrine.appointment.repositories.mongodb.MedicalRecordDrugRepository;
import dev.skyherobrine.appointment.repositories.mongodb.MedicalRecordRepository;
import dev.skyherobrine.appointment.services.MedicalRecordService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/appointment/api/v1/medical_record")
@Slf4j
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;
    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicalRecordDrugRepository medicalRecordDrugRepository;
    private final WorkScheduleFeign workScheduleFeign;

    public MedicalRecordController(MedicalRecordService medicalRecordService, MedicalRecordRepository medicalRecordRepository, MedicalRecordDrugRepository medicalRecordDrugRepository, WorkScheduleFeign workScheduleFeign) {
        this.medicalRecordService = medicalRecordService;
        this.medicalRecordRepository = medicalRecordRepository;
        this.medicalRecordDrugRepository = medicalRecordDrugRepository;
        this.workScheduleFeign = workScheduleFeign;
    }

    @PostMapping
    public ResponseEntity<Response> addMedicalRecord(@RequestBody MedicalRecordDTO medicalRecordDTO) {
        try {
            log.info("Medical Record: Call the api add medical record");
            MedicalRecord target = medicalRecordService.addMedicalRecord(medicalRecordDTO);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Medical record added",
                    target
            ));
        } catch (Exception e) {
            log.error("Medical Record: The api thrown an exception");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Can't add the medical record",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/book_appointment/{id}")
    public ResponseEntity<Response> getMedicalRecord(
            @PathVariable("id") String bookAppointmentId
    ) {
        try {
            log.info("Medical Record: Call the api get medical record");
            Map<String,Object> result = new HashMap<>();
            MedicalRecord target = medicalRecordRepository.findByBookAppointment_Id(Long.parseLong(bookAppointmentId)).orElse(null);
            if(target != null) {
                result.put("medical_record", target);
                result.put("drugs", medicalRecordDrugRepository.findById_MedicalRecord_Id(target.getId()));
                result.put("doctor", workScheduleFeign.getById(target.getBookAppointment().getWorkSchedule()).getBody().getData());
            }
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get the medical record information",
                    result
            ));
        } catch (Exception e) {
            log.error("Medical Record: The api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/book_appointment/previous")
    public ResponseEntity<Response> getMedicalRecordPrevious(
            @RequestParam String userId,
            @RequestParam String bookAppointmentId
    ) {
        try {
            log.info("Medical Record: Call the api the medical records previous");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get the medical records previous",
                    medicalRecordService.getPreviousMedicalRecord(userId, bookAppointmentId)
            ));
        } catch (Exception e) {
            log.error("Medical Record: The api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<Response> getAll(@RequestParam String userId) {
        try {
            log.info("Medical Record: Call the api get all medical records");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get all medical records",
                    medicalRecordService.getAllMedicalRecords(userId)
            ));
        } catch (Exception e) {
            log.error("Medical Record: The api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }
}
