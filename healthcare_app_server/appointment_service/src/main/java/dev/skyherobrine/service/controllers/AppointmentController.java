package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.dtos.AppointmentDTO;
import dev.skyherobrine.service.models.Appointment;
import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.repositories.AppointmentRepository;
import dev.skyherobrine.service.services.AppointmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointment/api/v1/appointments")
@Slf4j
public class AppointmentController {

    private final AppointmentRepository ar;
    private final AppointmentService as;

    public AppointmentController(AppointmentRepository ar, AppointmentService as) {
        this.ar = ar;
        this.as = as;
    }

    @GetMapping("/patient")
    public ResponseEntity<Response> getAllAppointmentsByPatient(@RequestParam("userId") String patientId) {
        try {
            log.info("Appointment: Call the api get all appointments by patient");
            List<Appointment> appointments = as.getAppointmentsByPatient(patientId);

            if(appointments != null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Get all appointments by patient successfully",
                        appointments
                ));
            }
            return ResponseEntity.ok(new Response(
                    HttpStatus.NOT_FOUND.value(),
                    "There are no any appointments for this patient",
                    null
            ));
        } catch (Exception e) {
            log.error("Appointment: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api get all appointments by patient return an error",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/doctor")
    public ResponseEntity<Response> getAllAppointmentsByDoctor(@RequestParam("userId") String doctorId) {
        try {
            log.info("Appointment: Call the api get all appointments by doctor");
            List<Appointment> appointments = as.getAppointmentsByDoctor(doctorId);

            if(appointments != null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Get all appointments by doctor successfully",
                        appointments
                ));
            }
            return ResponseEntity.ok(new Response(
                    HttpStatus.NOT_FOUND.value(),
                    "There are no any appointments for this doctor",
                    null
            ));
        } catch (Exception e) {
            log.error("Appointment: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api get all appointments by doctor return an error",
                    e.getMessage()
            ));
        }
    }
}
