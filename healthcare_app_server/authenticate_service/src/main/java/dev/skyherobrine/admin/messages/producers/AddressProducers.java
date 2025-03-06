package dev.skyherobrine.admin.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class AddressProducers {

    @Bean
    public NewTopic insertAddress() {
        return TopicBuilder.name("insert_address").build();
    }
}
