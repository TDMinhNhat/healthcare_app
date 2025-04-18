package dev.skyherobrine.admin.controllers.impl;

import dev.skyherobrine.admin.enums.AppointmentStatus;
import dev.skyherobrine.admin.models.mariadb.Response;
import dev.skyherobrine.admin.repositories.mongodb.BookAppointmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/api/v1/appointments")
@Slf4j
public class BookAppointmentController {

    private final BookAppointmentRepository bookAppointmentRepository;

    public BookAppointmentController(BookAppointmentRepository bookAppointmentRepository) {
        this.bookAppointmentRepository = bookAppointmentRepository;
    }

    @GetMapping
    public ResponseEntity<Response> getAllBookAppointment() {
        log.info("Book Appointment: Call the api get all book appointments");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all book appointments successfully",
                bookAppointmentRepository.findAll()
        ));
    }

    @GetMapping("/status")
    public ResponseEntity<Response> getAllBookAppointmentByStatus(
            @RequestParam("status") String status
    ) {
        log.info("Book Appointment: Call the api get all book appointments by status");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all book appointments by status successfully",
                bookAppointmentRepository.findByStatus(AppointmentStatus.valueOf(status))
        ));
    }
}
