package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.dtos.AppointmentDTO;
import dev.skyherobrine.service.models.Appointment;
import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.repositories.AppointmentRepository;
import dev.skyherobrine.service.services.BookingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointment/api/v1/booking")
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Response> bookingAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        try {
            log.info("Appointment: Call the api booking appointment");
            Appointment appointment = bookingService.booking(appointmentDTO);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Booking appointment successfully",
                    appointment
            ));
        } catch (Exception e) {
            log.error("Appointment: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api booking appointment was return an error",
                    e.getMessage()
            ));
        }
    }
}
