package dev.skyherobrine.appointment.controllers;

import dev.skyherobrine.appointment.enums.AppointmentStatus;
import dev.skyherobrine.appointment.feigns.WorkScheduleFeign;
import dev.skyherobrine.appointment.models.Response;
import dev.skyherobrine.appointment.models.mongodb.Appointment;
import dev.skyherobrine.appointment.repositories.mongodb.AppointmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/appointment/api/v1/appointments")
@Slf4j
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final WorkScheduleFeign workScheduleFeign;

    public AppointmentController(AppointmentRepository appointmentRepository, WorkScheduleFeign workScheduleFeign) {
        this.appointmentRepository = appointmentRepository;
        this.workScheduleFeign = workScheduleFeign;
    }

    @GetMapping("/doctor/status")
    public ResponseEntity<Response> getAppointmentDoctorByStatus(@RequestParam String doctorId, @RequestParam String status) {
        try {
            log.info("Appointment: Call the api to get doctor's appointments by status");
            List<Long> workSchedules = (List<Long>) workScheduleFeign.getWorkScheduleIdByDoctorId(doctorId).getBody().getData();
            List<Appointment> result = appointmentRepository.findByStatus(AppointmentStatus.valueOf(status)).stream().filter(appointment -> workSchedules.contains(appointment.getWorkSchedule())).toList();
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get the appointments by status",
                    result
            ));
        } catch (Exception e) {
            log.error("Appointment: The api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    null
            ));
        }
    }

    @GetMapping("/patient/status")
    public ResponseEntity<Response> getAppointmentPatientByStatus(@RequestParam String patientId, @RequestParam String status) {
        try {
            log.info("Appointment: Call the api to get patient's appointments by status");
            List<Appointment> result = appointmentRepository.findByPatientAndStatus(patientId, AppointmentStatus.valueOf(status));
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get the appointments by status",
                    result
            ));
        } catch (Exception e) {
            log.error("Appointment: The api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    null
            ));
        }
    }
}
