package dev.skyherobrine.admin.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class DrugProducer {

    @Bean
    public NewTopic insertDrug() {
        return TopicBuilder.name("insert_drug").build();
    }

    @Bean
    public NewTopic updateDrug() {
        return TopicBuilder.name("update_drug").build();
    }
}
