package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.dtos.MedicalRecordDTO;
import dev.skyherobrine.service.models.mariadb.MedicalRecord;
import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.services.MedicalRecordService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointment/api/v1/medical_record")
@Slf4j
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
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
}
