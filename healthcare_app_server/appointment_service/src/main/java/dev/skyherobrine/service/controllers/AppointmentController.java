package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.repositories.AppointmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("appointment/api/v1/appointment")
@Slf4j
public class AppointmentController {

    private final AppointmentRepository ar;

    public AppointmentController(AppointmentRepository ar) {
        this.ar = ar;
    }

    @GetMapping("user/{id}")
    public ResponseEntity<Response> getAllAppointmentsByUser(@PathVariable("id") String userId) {
        try {
            log.info("Call get all appointments from user method");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get all appointments from user",
                    ar.findByUserId(Long.parseLong(userId))
            ));
        } catch (Exception e) {
            log.error("Server return an error: {}", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Server return an error",
                    e
            ));
        }
    }

    @GetMapping("doctor/{id}")
    public ResponseEntity<Response> getAllAppointmentsByDoctor(@PathVariable("id") String doctorId) {
        try {
            log.info("Call get all appointments from doctor method");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get all appointments from doctor",
                    ar.findByDoctorId(Long.parseLong(doctorId))
            ));
        } catch (Exception e) {
            log.error("Server return an error: {}", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Server return an error",
                    e
            ));
        }
    }

    @GetMapping("user_doctor")
    public ResponseEntity<Response> getAllAppointmentsByUserAndDoctor(
            @RequestParam("userId") String userId,
            @RequestParam("doctorId") String doctorId
    ) {
        try {
            log.info("Call get all appointments from user and doctor method");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get all appointments from user and doctor",
                    ar.findByUserIdAndDoctorId(Long.parseLong(userId), Long.parseLong(doctorId))
            ));
        } catch (Exception e) {
            log.error("Server return an error: {}", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Server return an error",
                    e
            ));
        }
    }
}
