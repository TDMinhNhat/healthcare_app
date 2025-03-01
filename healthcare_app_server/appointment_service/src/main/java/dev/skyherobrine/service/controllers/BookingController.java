package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.dtos.AppointmentDTO;
import dev.skyherobrine.service.feigns.DoctorFeign;
import dev.skyherobrine.service.models.Appointment;
import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.repositories.AppointmentRepository;
import dev.skyherobrine.service.services.BookingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/appointment/api/v1/booking")
@Slf4j
public class BookingController {

    private final BookingService bookingService;
    private final AppointmentRepository ar;
    private final DoctorFeign doctorFeign;

    public BookingController(BookingService bookingService, AppointmentRepository ar, DoctorFeign doctorFeign) {
        this.bookingService = bookingService;
        this.ar = ar;
        this.doctorFeign = doctorFeign;
    }

    @PostMapping
    public ResponseEntity<Response> bookingAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        try {
            log.info("Booking: Call the api booking appointment");
            Appointment appointment = bookingService.booking(appointmentDTO);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Booking appointment successfully",
                    appointment
            ));
        } catch (Exception e) {
            log.error("Booking: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api booking appointment was return an error",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/doctor")
    public ResponseEntity<Response> getDoctorAppointmentAvoidStartTime(
            @RequestParam("start") String start
    ) {
        try {
            log.info("Booking: Call the api get doctors appointment free the start time");
            log.info("Booking: Time for check is {}", start);
            List<String> listDoctorsId = ar.findDoctorFreeStartTime(LocalDateTime.parse(start, DateTimeFormatter.ofPattern("dd-MM-yyyy-HH-mm-ss")));
            log.info("Booking: Found {} doctors", listDoctorsId.size());
            return doctorFeign.getAllDoctor(listDoctorsId);
        } catch (Exception e) {
            log.error("Booking: Can't get the doctors appointment free the start time");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api get doctors appointment free the start time return an error",
                    e.getMessage()
            ));
        }
    }
}
