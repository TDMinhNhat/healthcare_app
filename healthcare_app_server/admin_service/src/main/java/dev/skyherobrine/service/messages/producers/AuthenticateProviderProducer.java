package dev.skyherobrine.service.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticateProviderProducer {

    @Bean
    public NewTopic insertAuthenticateProvider() {
        return TopicBuilder.name("insert_authenticate_provider").build();
    }
}
