package dev.skyherobrine.appointment.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class PaymentProducer {

    @Bean
    public NewTopic addPayment() {
        return TopicBuilder.name("insert_payment").build();
    }
}
