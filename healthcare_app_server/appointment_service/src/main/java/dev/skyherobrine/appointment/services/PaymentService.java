package dev.skyherobrine.appointment.services;

import dev.skyherobrine.appointment.dtos.PaymentDTO;
import dev.skyherobrine.appointment.models.mongodb.Payment;
import dev.skyherobrine.appointment.repositories.mongodb.BookAppointmentRepository;
import dev.skyherobrine.appointment.repositories.mongodb.PaymentRepository;
import dev.skyherobrine.appointment.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookAppointmentRepository bookAppointmentRepository;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public PaymentService(PaymentRepository paymentRepository, BookAppointmentRepository bookAppointmentRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.paymentRepository = paymentRepository;
        this.bookAppointmentRepository = bookAppointmentRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public Payment addPayment(PaymentDTO paymentDTO) throws Exception {
        log.info("Payment Service: Call the service add the payment");
        kafkaTemplate.send("insert_payment", ObjectParser.convertObjectToJson(paymentDTO));

        Payment payment = new Payment(
                getMaxId(),
                paymentDTO.getAuthorName(),
                paymentDTO.getBankingName(),
                paymentDTO.getPrice(),
                bookAppointmentRepository.findById(Long.parseLong(paymentDTO.getBookAppointmentId())).orElseThrow(() -> new EntityNotFoundException("The book appointment was not found!")),
                LocalDateTime.now()
        );
        return paymentRepository.save(payment);
    }

    private Long getMaxId() {
        Payment target = paymentRepository.findTopByOrderByIdDesc().orElse(null);
        return target == null ? 1L : (target.getId() + 1);
    }
}
