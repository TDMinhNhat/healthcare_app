package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.dtos.AppointmentDTO;
import dev.skyherobrine.service.enums.AppointmentStatus;
import dev.skyherobrine.service.feigns.DoctorFeign;
import dev.skyherobrine.service.models.mongodb.Appointment;
import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.repositories.AppointmentRepository;
import dev.skyherobrine.service.services.BookingService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/appointment/api/v1/booking")
@Slf4j
public class BookingController {

    private final BookingService bookingService;
    private final AppointmentRepository ar;
    private final DoctorFeign doctorFeign;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public BookingController(BookingService bookingService, AppointmentRepository ar, DoctorFeign doctorFeign, KafkaTemplate<String, String> kafkaTemplate) {
        this.bookingService = bookingService;
        this.ar = ar;
        this.doctorFeign = doctorFeign;
        this.kafkaTemplate = kafkaTemplate;
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

    @PutMapping("/cancel")
    public ResponseEntity<Response> cancelAppointment(
            @RequestParam("roomId") String roomId
    ) {
        try {
            log.info("Booking: Call the api cancel appointment");
            kafkaTemplate.send("cancel_appointment", roomId);
            Appointment appointment = ar.findAppointmentByRoomId(roomId).orElseThrow(() -> new EntityNotFoundException("The appointment wasn't found!"));
            appointment.setStatus(AppointmentStatus.CANCELLED);
            Appointment result = ar.save(appointment);
            log.info("Booking: The appointment was canceled");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Cancel appointment successfully",
                    result
            ));
        } catch (Exception e) {
            log.error("Booking: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api cancel appointment was return an error",
                    e.getMessage()
                ));
        }
    }
}
