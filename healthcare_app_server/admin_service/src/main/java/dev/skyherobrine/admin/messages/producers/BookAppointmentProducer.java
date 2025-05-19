package dev.skyherobrine.admin.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class BookAppointmentProducer {

    @Bean
    public NewTopic assignPayback() {
        return TopicBuilder.name("assign_payback").build();
    }
}
