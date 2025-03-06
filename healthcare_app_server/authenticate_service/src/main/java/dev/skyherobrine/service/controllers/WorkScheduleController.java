package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.dtos.WorkScheduleDTO;
import dev.skyherobrine.service.models.mariadb.Doctor;
import dev.skyherobrine.service.models.mariadb.Response;
import dev.skyherobrine.service.models.mongodb.WorkSchedule;
import dev.skyherobrine.service.repositories.mariadb.DoctorRepository;
import dev.skyherobrine.service.repositories.mongodb.WorkScheduleRepository;
import dev.skyherobrine.service.services.WorkScheduleService;
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

    private final WorkScheduleService workScheduleService;

    public WorkScheduleController(WorkScheduleService workScheduleService) {
        this.workScheduleService = workScheduleService;
    }

    @PostMapping
    public synchronized ResponseEntity<Response> addWorkSchedule(@RequestBody WorkScheduleDTO workScheduleDTO) {
        try {
            log.info("Work Schedule: Call the api add work schedule of the doctor");

            WorkSchedule result = workScheduleService.addWorkSchedule(workScheduleDTO);

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
