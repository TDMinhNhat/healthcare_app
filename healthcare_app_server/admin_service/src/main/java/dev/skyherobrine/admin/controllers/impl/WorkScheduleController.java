package dev.skyherobrine.admin.controllers.impl;

import dev.skyherobrine.admin.controllers.IManagement;
import dev.skyherobrine.admin.models.mariadb.Response;
import dev.skyherobrine.admin.models.mongodb.WorkSchedule;
import dev.skyherobrine.admin.repositories.mongodb.WorkScheduleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/api/v1/work_schedule")
@Slf4j
public class WorkScheduleController implements IManagement<WorkSchedule,Long> {

    private final WorkScheduleRepository workScheduleRepository;

    public WorkScheduleController(WorkScheduleRepository workScheduleRepository) {
        this.workScheduleRepository = workScheduleRepository;
    }

    @GetMapping
    @Override
    public ResponseEntity<Response> getAll() {
        log.info("Work Schedule: Call the api get all work schedules");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all work schedules successfully",
                workScheduleRepository.findAll()
        ));
    }

    @GetMapping("/{id}")
    @Override
    public ResponseEntity<Response> getById(@PathVariable("id") Long id) {
        log.info("Work Schedule: Call the api get the work schedule by Id");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get the work schedule detail by id",
                workScheduleRepository.findById(id).orElse(null)
        ));
    }

    @Override
    public ResponseEntity<Response> add(WorkSchedule workSchedule) {
        return null;
    }

    @Override
    public ResponseEntity<Response> update(Long aLong, WorkSchedule workSchedule) {
        return null;
    }

    @Override
    public ResponseEntity<Response> delete(Long aLong) {
        return null;
    }
}
