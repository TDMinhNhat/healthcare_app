package dev.skyherobrine.service.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class UserRoleProducer {

    @Bean
    public NewTopic insertUserRole() {
        return TopicBuilder.name("insert_user_role").build();
    }
}
