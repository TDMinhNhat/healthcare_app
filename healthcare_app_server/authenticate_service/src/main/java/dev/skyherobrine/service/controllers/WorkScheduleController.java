package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.dtos.WorkScheduleDTO;
import dev.skyherobrine.service.models.mariadb.Doctor;
import dev.skyherobrine.service.models.mariadb.Response;
import dev.skyherobrine.service.models.mongodb.WorkSchedule;
import dev.skyherobrine.service.repositories.mariadb.DoctorRepository;
import dev.skyherobrine.service.repositories.mongodb.WorkScheduleRepository;
import dev.skyherobrine.service.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/authenticate/api/v1/work_schedule")
@Slf4j
public class WorkScheduleController {

    private final WorkScheduleRepository workScheduleRepository;
    private final DoctorRepository doctorRepository;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public WorkScheduleController(WorkScheduleRepository workScheduleRepository, DoctorRepository doctorRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.workScheduleRepository = workScheduleRepository;
        this.doctorRepository = doctorRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @PostMapping
    public ResponseEntity<Response> addWorkSchedule(@RequestBody WorkScheduleDTO workScheduleDTO) {
        try {
            log.info("Work Schedule: Call the api add work schedule of the doctor");
            Doctor doctor = doctorRepository.findDoctorByUserId(workScheduleDTO.getDoctorId()).orElseThrow(() -> new EntityNotFoundException("The doctor wasn't found!"));
            WorkSchedule workSchedule = new WorkSchedule(
                    doctor,
                    workScheduleDTO.getTypeDay(),
                    LocalDateTime.parse(workScheduleDTO.getTimeStart(), DateTimeFormatter.ofPattern("dd-MM-yyyy-HH-mm-ss")),
                    LocalDateTime.parse(workScheduleDTO.getTimeEnd(), DateTimeFormatter.ofPattern("dd-MM-yyyy-HH-mm-ss"))
            );
            kafkaTemplate.send("insert_work_schedule", ObjectParser.convertObjectToJson(workSchedule));

            WorkSchedule result = workScheduleRepository.save(workSchedule);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Add the work schedule successfully",
                    result
            ));

        } catch (Exception e) {
            log.error("Work Schedule: The api thrown an exception");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }
}
