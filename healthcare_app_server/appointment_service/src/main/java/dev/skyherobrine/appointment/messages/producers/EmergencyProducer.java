package dev.skyherobrine.appointment.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class EmergencyProducer {

    @Bean
    public NewTopic addEmergency() {
        return TopicBuilder.name("insert_emergency").build();
    }
}
