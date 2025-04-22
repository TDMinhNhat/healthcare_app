package dev.skyherobrine.admin.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class PriceProducer {

    @Bean
    public NewTopic insertPrice() {
        return TopicBuilder.name("insert_price").build();
    }

    @Bean
    public NewTopic updatePrice() {
        return TopicBuilder.name("update_price").build();
    }

    @Bean
    public NewTopic deletePrice() {
        return TopicBuilder.name("delete_price").build();
    }
}
