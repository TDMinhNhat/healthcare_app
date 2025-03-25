package dev.skyherobrine.admin.messages.consumes;

import dev.skyherobrine.admin.models.mongodb.Payment;
import dev.skyherobrine.admin.repositories.mongodb.PaymentRepository;
import dev.skyherobrine.admin.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class PaymentConsumer {

    private final PaymentRepository paymentRepository;

    public PaymentConsumer(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @KafkaListener(topics = "insert_payment", groupId = "admin_insert_payment")
    public void addPayment(String message) {
        try {
            log.info("Payment Consumer: listen the message for insert payment");
            Payment target = ObjectParser.convertJsonToObject(message, Payment.class);
            paymentRepository.save(target);
            log.info("Payment Consumer: insert payment successfully!");
        } catch (Exception e) {
            log.error("Payment Consumer: the consumer thrown an exception");
            log.error(e.getMessage());
        }
    }
}
