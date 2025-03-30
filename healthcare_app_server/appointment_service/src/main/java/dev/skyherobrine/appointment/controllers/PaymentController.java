package dev.skyherobrine.appointment.controllers;

import dev.skyherobrine.appointment.dtos.PaymentDTO;
import dev.skyherobrine.appointment.models.Response;
import dev.skyherobrine.appointment.repositories.mongodb.PaymentRepository;
import dev.skyherobrine.appointment.services.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/appointment/api/v1/payment")
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentService paymentService, PaymentRepository paymentRepository) {
        this.paymentService = paymentService;
        this.paymentRepository = paymentRepository;
    }

    @PostMapping
    public ResponseEntity<Response> addPayment(@RequestBody PaymentDTO paymentDTO) {
        try {
            log.info("Payment: Call the api add the payment");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Add the payment successfully!",
                    paymentService.addPayment(paymentDTO)
            ));
        } catch (Exception e) {
            log.error("Payment: The api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/patient")
    public ResponseEntity<Response> getAllPaymentByUserId(@RequestParam("patientId") String patientId) {
        try {
            log.info("Payment: Call the api get all payments by patient id");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get all payments by patient id successfully!",
                    paymentRepository.findByBookAppointment_PatientId(patientId)
            ));
        } catch (Exception e) {
            log.error("Payment: The api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/book_appointment")
    public ResponseEntity<Response> getPaymentByBookAppointment(@RequestParam("bookAppointmentId") String bookAppointmentId) {
        try {
            log.info("Payment: Call the api get payment by book appointment id");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get payment by book appointment id successfully!",
                    paymentRepository.findByBookAppointment_Id(Long.parseLong(bookAppointmentId)).orElse(null)
            ));
        } catch (Exception e) {
            log.error("Payment: The api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }
}
