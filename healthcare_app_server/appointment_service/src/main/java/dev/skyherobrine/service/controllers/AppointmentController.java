package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.dtos.AppointmentDTO;
import dev.skyherobrine.service.enums.AppointmentStatus;
import dev.skyherobrine.service.feigns.DoctorFeign;
import dev.skyherobrine.service.feigns.WorkScheduleFeign;
import dev.skyherobrine.service.models.Appointment;
import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.repositories.AppointmentRepository;
import dev.skyherobrine.service.services.AppointmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/appointment/api/v1/appointments")
@Slf4j
public class AppointmentController {

    private final AppointmentRepository ar;
    private final AppointmentService as;
    private final WorkScheduleFeign wsf;

    public AppointmentController(AppointmentRepository ar, AppointmentService as, WorkScheduleFeign wsf) {
        this.ar = ar;
        this.as = as;
        this.wsf = wsf;
    }

    @GetMapping("/patient")
    public ResponseEntity<Response> getAllAppointmentsByPatient(@RequestParam("userId") String patientId) {
        try {
            log.info("Appointment: Call the api get all appointments by patient");
            List<Map<String,Object>> result = new ArrayList<>();
            List<Appointment> appointments = as.getAppointmentsByPatient(patientId);
            appointments.forEach(appointment -> {
                Map<String,Object> data = new HashMap<>();
                data.put("appointment", appointment);
                data.put("work_schedule", wsf.getById(appointment.getWorkSchedule()).getBody().getData());
                result.add(data);
            });
            if(appointments != null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Get all appointments by patient successfully",
                        result
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
            List<Map<String,Object>> result = new ArrayList<>();
            List<Appointment> appointments = as.getAppointmentsByDoctor(doctorId);
            appointments.forEach(appointment -> {
                Map<String,Object> data = new HashMap<>();
                data.put("appointment", appointment);
                data.put("work_schedule", wsf.getById(appointment.getWorkSchedule()).getBody().getData());
                result.add(data);
            });
            if(appointments != null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Get all appointments by doctor successfully",
                        result
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

    @GetMapping("/roomId")
    public ResponseEntity<Response> getAppointmentByRoomId(@RequestParam String roomId) {
        try {
            log.info("Appointment: Call the api get appointment by room id");
            Appointment appointment = ar.findAppointmentByRoomId(roomId).orElse(null);
            if(appointment != null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Get appointment by room id successfully",
                        appointment
                ));
            }
            return ResponseEntity.ok(new Response(
                    HttpStatus.NOT_FOUND.value(),
                    "There are no any appointments for this room id",
                    null
            ));
        } catch (Exception e) {
            log.error("Appointment: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api get appointment by room id return an error",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Response> getAppointmentByStatus(@RequestParam AppointmentStatus status) {
        try {
            log.info("Appointment: Call the api get appointment by status");
            List<Map<String,Object>> result = new ArrayList<>();
            List<Appointment> appointments = ar.findByStatus(status);
            appointments.forEach(appointment -> {
                Map<String,Object> data = new HashMap<>();
                data.put("appointment", appointment);
                data.put("work_schedule", wsf.getById(appointment.getWorkSchedule()).getBody().getData());
                result.add(data);
            });
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get appointment by status successfully",
                    result
            ));
        } catch (Exception e) {
            log.error("Appointment: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api get appointment by status return an error",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/status_with_patient")
    public ResponseEntity<Response> getAppointmentByStatus(
            @RequestParam String patientId,
            @RequestParam AppointmentStatus status
    ) {
        try {
            log.info("Appointment: Call the api get appointment by status (need patient)");
            List<Map<String,Object>> result = new ArrayList<>();
            List<Appointment> appointments = ar.findByPatientAndStatus(patientId, status);
            appointments.forEach(appointment -> {
                Map<String,Object> data = new HashMap<>();
                data.put("appointment", appointment);
                data.put("work_schedule", wsf.getById(appointment.getWorkSchedule()).getBody().getData());
                result.add(data);
            });
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get appointment by patient and status successfully",
                    result
            ));
        } catch (Exception e) {
            log.error("Appointment: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api get appointment by status return an error",
                    e.getMessage()
            ));
        }
    }
}
