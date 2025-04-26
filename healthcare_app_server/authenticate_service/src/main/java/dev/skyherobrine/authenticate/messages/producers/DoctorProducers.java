package dev.skyherobrine.authenticate.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class DoctorProducers {

    @Bean
    public NewTopic updateDoctorAvatar() {
        return TopicBuilder.name("update_doctor_avatar").build();
    }
}
