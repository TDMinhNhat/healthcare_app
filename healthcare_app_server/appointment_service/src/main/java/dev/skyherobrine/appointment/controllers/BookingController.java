package dev.skyherobrine.appointment.controllers;

import dev.skyherobrine.appointment.dtos.AppointmentDTO;
import dev.skyherobrine.appointment.feigns.DoctorFeign;
import dev.skyherobrine.appointment.models.Response;
import dev.skyherobrine.appointment.services.BookingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/appointment/api/v1/booking")
@Slf4j
public class BookingController {

    private final BookingService bookingService;
    private final DoctorFeign doctorFeign;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public BookingController(BookingService bookingService, DoctorFeign doctorFeign, KafkaTemplate<String, String> kafkaTemplate) {
        this.bookingService = bookingService;
        this.doctorFeign = doctorFeign;
        this.kafkaTemplate = kafkaTemplate;
    }

    @PostMapping
    public ResponseEntity<Response> bookingAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        try {
            log.info("Booking: Call the api booking appointment");
            Map<String,Object> result = bookingService.booking(appointmentDTO);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Booking appointment successfully",
                    result
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
//            Appointment appointment = ar.findAppointmentByRoomId(roomId).orElseThrow(() -> new EntityNotFoundException("The appointment wasn't found!"));
//            appointment.setStatus(AppointmentStatus.CANCELLED);
//            Appointment result = ar.save(appointment);
            log.info("Booking: The appointment was canceled");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Cancel appointment successfully",
//                    result
                    null
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

    @GetMapping("/week/patient/{patientId}")
    public ResponseEntity<Response> getBookAppointmentByPatientInWeek(
            @PathVariable("patientId") String patientId,
            @RequestParam("start") String start,
            @RequestParam("end") String end
    ) {
        try {
            log.info("Booking: Call the api get book appointment by patient in week");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get book appointment by patient in week successfully",
                    bookingService.getAppointmentByPatientInWeek(patientId, start, end)
            ));
        } catch (Exception e) {
            log.error("Booking: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api get book appointment by patient in week was return an error",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/detail")
    public ResponseEntity<Response> getAppointmentDetail(@RequestParam("workSchedule") Long workSchedule) {
        log.info("Booking: Call the api get appointment detail");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get appointment detail successfully",
                bookingService.getAppointmentDetail(workSchedule)
        ));
    }
}
