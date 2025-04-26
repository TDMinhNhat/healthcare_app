package dev.skyherobrine.admin.controllers.impl;

import dev.skyherobrine.admin.enums.AppointmentStatus;
import dev.skyherobrine.admin.enums.PaymentStatus;
import dev.skyherobrine.admin.models.mariadb.Response;
import dev.skyherobrine.admin.models.mongodb.BookAppointment;
import dev.skyherobrine.admin.models.mongodb.BookAppointmentPayment;
import dev.skyherobrine.admin.repositories.mongodb.BookAppointmentPaymentRepository;
import dev.skyherobrine.admin.repositories.mongodb.BookAppointmentRepository;
import dev.skyherobrine.admin.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/v1/appointments")
@Slf4j
public class BookAppointmentController {

    private final BookAppointmentRepository bookAppointmentRepository;
    private final BookAppointmentPaymentRepository bookAppointmentPaymentRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public BookAppointmentController(BookAppointmentRepository bookAppointmentRepository, BookAppointmentPaymentRepository bookAppointmentPaymentRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.bookAppointmentRepository = bookAppointmentRepository;
        this.bookAppointmentPaymentRepository = bookAppointmentPaymentRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @GetMapping
    public ResponseEntity<Response> getAllBookAppointment() {
        log.info("Book Appointment: Call the api get all book appointments");
        List<Map<String,Object>> result = new ArrayList<>();
        bookAppointmentRepository.findAll().forEach(item -> {
            Map<String,Object> data = new HashMap<>();
            data.put("bookAppointment", item);
            data.put("bookAppointmentPayment", bookAppointmentPaymentRepository.findByBookAppointment_Id(item.getId()).orElse(null));
            result.add(data);
        });
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all book appointments successfully",
                result
        ));
    }

    @GetMapping("/status")
    public ResponseEntity<Response> getAllBookAppointmentByStatus(
            @RequestParam("status") String status
    ) {
        log.info("Book Appointment: Call the api get all book appointments by status");
        List<Map<String,Object>> result = new ArrayList<>();
        bookAppointmentRepository.findByStatus(AppointmentStatus.valueOf(status)).forEach(item -> {
            Map<String,Object> data = new HashMap<>();
            data.put("bookAppointment", item);
            data.put("bookAppointmentPayment", bookAppointmentPaymentRepository.findByBookAppointment_Id(item.getId()).orElse(null));
            result.add(data);
        });
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all book appointments by status successfully",
                result
        ));
    }

    @GetMapping("/payment_status")
    public ResponseEntity<Response> getAllBookAppointmentByPaymentStatus(
            @RequestParam("paymentStatus") String paymentStatus
    ) {
        log.info("Book Appointment: Call the api get all book appointments by payment status");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all book appointments by payment status successfully",
                bookAppointmentPaymentRepository.findByStatus(PaymentStatus.valueOf(paymentStatus))
        ));
    }

    @PostMapping("/assign_paybackment")
    public ResponseEntity<Response> assignPaybackment(
            @RequestParam("bookAppointmentId") String bookAppointmentId
    ) {
        try {
            log.info("Book Appointment: Call the api assign paybackment");
            BookAppointment bookAppointment = bookAppointmentRepository.findById(Long.parseLong(bookAppointmentId)).orElse(null);
            if(bookAppointment != null) {
                BookAppointmentPayment bookAppointmentPayment = bookAppointmentPaymentRepository.findByBookAppointment_Id(bookAppointment.getId()).orElse(null);
                if(bookAppointmentPayment != null) {
                    bookAppointmentPayment.setStatus(PaymentStatus.PAY_BACK);
                    kafkaTemplate.send("assign_payback", ObjectParser.convertObjectToJson(bookAppointment.getId() + ""));
                    log.info("Book Appointment: Assign paybackment successfully");
                    return ResponseEntity.ok(new Response(
                            HttpStatus.OK.value(),
                            "Assign paybackment successfully",
                            bookAppointmentPaymentRepository.save(bookAppointmentPayment)
                    ));
                }
                log.warn("Book Appointment: Book appointment payment was not found");
                return ResponseEntity.ok(new Response(
                        HttpStatus.NOT_FOUND.value(),
                        "Book appointment payment was not found",
                        null
                ));
            } else {
                return ResponseEntity.ok(new Response(
                        HttpStatus.NOT_FOUND.value(),
                        "Book appointment not found",
                        null
                ));
            }
        } catch (Exception e) {
            log.error("Book Appointment: Error when assign paybackment");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Error when assign paybackment",
                    e.getMessage()
            ));
        }
    }
}
