package dev.skyherobrine.authenticate.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class PatientProducer {

    @Bean
    public NewTopic insertPatient() {
        return TopicBuilder.name("insert_patient").build();
    }

    @Bean
    public NewTopic updateVerifyEmail() {
        return TopicBuilder.name("update_verify_email").build();
    }

    @Bean
    public NewTopic updateInfo() {
        return TopicBuilder.name("update_patient_info").build();
    }
}
