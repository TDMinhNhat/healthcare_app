package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.dtos.AppointmentDTO;
import dev.skyherobrine.service.enums.AppointmentStatus;
import dev.skyherobrine.service.feigns.DoctorFeign;
import dev.skyherobrine.service.models.Appointment;
import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.repositories.AppointmentRepository;
import dev.skyherobrine.service.services.AppointmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/appointment/api/v1/appointments")
@Slf4j
public class AppointmentController {

    private final AppointmentRepository ar;
    private final AppointmentService as;
    private final DoctorFeign doctorFeign;

    public AppointmentController(AppointmentRepository ar, AppointmentService as, DoctorFeign doctorFeign) {
        this.ar = ar;
        this.as = as;
        this.doctorFeign = doctorFeign;
    }

    @GetMapping("/patient")
    public ResponseEntity<Response> getAllAppointmentsByPatient(@RequestParam("userId") String patientId) {
        try {
            log.info("Appointment: Call the api get all appointments by patient");
            Map<String,Object> data = new HashMap<>();
            List<Appointment> appointments = as.getAppointmentsByPatient(patientId);
            appointments.forEach(appointment -> {
                data.put("appointment", appointment);
                data.put("doctor", doctorFeign.getDoctorInformation(appointment.getDoctor()).getBody().getData());
            });
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
            Map<String,Object> data = new HashMap<>();
            List<Appointment> appointments = as.getAppointmentsByDoctor(doctorId);
            appointments.forEach(appointment -> {
                data.put("appointment", appointment);
                data.put("doctor", doctorFeign.getDoctorInformation(appointment.getDoctor()).getBody().getData());
            });
            if(appointments != null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Get all appointments by doctor successfully",
                        data
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
            Map<String,Object> data = new HashMap<>();
            List<Appointment> appointments = ar.findByStatus(status);
            appointments.forEach(appointment -> {
                data.put("appointment", appointment);
                data.put("doctor", doctorFeign.getDoctorInformation(appointment.getDoctor()).getBody().getData());
            });
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get appointment by status successfully",
                    data
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
            Map<String,Object> data = new HashMap<>();
            List<Appointment> appointments = ar.findByPatientAndStatus(patientId, status);
            appointments.forEach(appointment -> {
                data.put("appointment", appointment);
                data.put("doctor", doctorFeign.getDoctorInformation(appointment.getDoctor()).getBody().getData());
            });
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get appointment by patient and status successfully",
                    data
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
