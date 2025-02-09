package dev.skyherobrine.service.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class TypeDetectProducer {

    @Bean
    public NewTopic insertTypeDetect() {
        return TopicBuilder.name("insert_type_detect").build();
    }
}
