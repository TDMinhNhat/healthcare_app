package dev.skyherobrine.authenticate.controllers;

import dev.skyherobrine.authenticate.models.mariadb.Response;
import dev.skyherobrine.authenticate.repositories.mariadb.ShiftRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/authenticate/api/v1/shift")
@Slf4j
public class ShiftController {

    private final ShiftRepository shiftRepository;

    public ShiftController(ShiftRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    @GetMapping
    public ResponseEntity<Response> getAllShifts() {
        log.info("Shift: Get all the shifts");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all the shifts",
                shiftRepository.findAll()
        ));
    }

    @GetMapping("/status")
    public ResponseEntity<Response> getShiftByStatus(
            @RequestParam String status
    ) {
        try {
            log.info("Shift: Get all the shifts by status");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get all the shifts by status",
                    shiftRepository.findByStatus(Boolean.parseBoolean(status))
            ));
        } catch (Exception e) {
            log.error("Shift: The api thrown an error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    null
            ));
        }
    }
}
