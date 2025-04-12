package dev.skyherobrine.admin.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class ShiftProducer {

    @Bean
    public NewTopic insertShift() {
        return TopicBuilder.name("insert_shift").build();
    }

    @Bean
    public NewTopic deleteShift() {
        return TopicBuilder.name("delete_shift").build();
    }
}
