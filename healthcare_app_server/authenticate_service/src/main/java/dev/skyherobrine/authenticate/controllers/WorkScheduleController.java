package dev.skyherobrine.authenticate.controllers;

import dev.skyherobrine.authenticate.dtos.WorkScheduleDTO;
import dev.skyherobrine.authenticate.models.mariadb.Response;
import dev.skyherobrine.authenticate.models.mongodb.WorkSchedule;
import dev.skyherobrine.authenticate.repositories.mongodb.WorkScheduleRepository;
import dev.skyherobrine.authenticate.services.WorkScheduleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/authenticate/api/v1/work_schedule")
@Slf4j
public class WorkScheduleController {

    private final WorkScheduleService workScheduleService;
    private final WorkScheduleRepository workScheduleRepository;

    public WorkScheduleController(WorkScheduleService workScheduleService, WorkScheduleRepository workScheduleRepository) {
        this.workScheduleService = workScheduleService;
        this.workScheduleRepository = workScheduleRepository;
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

    @GetMapping("/doctor")
    public ResponseEntity<Response> getWorkScheduleByDoctor(@RequestParam String doctorId) {
        try {
            log.info("Work Schedule: Call the api get work schedule by doctor");
            var result = workScheduleRepository.findAllByDoctor_UserId(doctorId);

            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get the work schedule by doctor successfully",
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
