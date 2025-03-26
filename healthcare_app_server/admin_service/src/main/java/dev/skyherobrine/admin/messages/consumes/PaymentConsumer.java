package dev.skyherobrine.admin.messages.consumes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.admin.models.mongodb.Payment;
import dev.skyherobrine.admin.repositories.mongodb.BookAppointmentRepository;
import dev.skyherobrine.admin.repositories.mongodb.PaymentRepository;
import dev.skyherobrine.admin.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
public class PaymentConsumer {

    private final PaymentRepository paymentRepository;
    private final BookAppointmentRepository bookAppointmentRepository;

    public PaymentConsumer(PaymentRepository paymentRepository, BookAppointmentRepository bookAppointmentRepository) {
        this.paymentRepository = paymentRepository;
        this.bookAppointmentRepository = bookAppointmentRepository;
    }

    @KafkaListener(topics = "insert_payment", groupId = "admin_insert_payment")
    public void addPayment(String message) {
        try {
            log.info("Payment Consumer: listen the message for insert payment");

            JsonNode node = new ObjectMapper().readTree(message);
            String getAuthorName = node.get("authorName").asText();
            String getBankingName = node.get("bankingName").asText();
            double getPrice = node.get("price").asDouble();
            String getBookAppointmentId = node.get("bookAppointmentId").asText();

            Payment target = new Payment(
                    paymentRepository.findTopByOrderByIdDesc().orElse(null) == null ? 1L : (paymentRepository.findTopByOrderByIdDesc().orElse(null).getId() + 1),
                    getAuthorName,
                    getBankingName,
                    getPrice,
                    bookAppointmentRepository.findById(Long.parseLong(getBookAppointmentId)).orElseThrow(() -> new EntityNotFoundException("The book appointment was not found!")),
                    LocalDateTime.now()
            );
            paymentRepository.save(target);
            log.info("Payment Consumer: insert payment successfully!");
        } catch (Exception e) {
            log.error("Payment Consumer: the consumer thrown an exception");
            log.error(e.getMessage());
        }
    }
}
