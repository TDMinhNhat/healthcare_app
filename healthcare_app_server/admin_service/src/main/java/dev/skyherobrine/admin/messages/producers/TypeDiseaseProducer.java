package dev.skyherobrine.admin.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class TypeDiseaseProducer {

    @Bean
    public NewTopic insertTypeDisease() {
        return TopicBuilder.name("insert_type_disease").build();
    }

    @Bean
    public NewTopic deleteTypeDisease() {
        return TopicBuilder.name("delete_type_disease").build();
    }
}
