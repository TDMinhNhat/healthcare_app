package dev.skyherobrine.appointment.controllers;

import dev.skyherobrine.appointment.dtos.PaymentDTO;
import dev.skyherobrine.appointment.models.Response;
import dev.skyherobrine.appointment.repositories.mongodb.PaymentRepository;
import dev.skyherobrine.appointment.services.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointment/api/v1/payment")
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
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
}
