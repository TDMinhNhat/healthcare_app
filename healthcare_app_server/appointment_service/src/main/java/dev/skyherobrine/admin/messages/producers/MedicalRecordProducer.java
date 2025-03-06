package dev.skyherobrine.admin.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class MedicalRecordProducer {

    @Bean
    public NewTopic insertMedicalRecord() {
        return TopicBuilder.name("insert_medical_record").build();
    }

    @Bean
    public NewTopic insertMedicalRecordDrug() {
        return TopicBuilder.name("insert_medical_record_drug").build();
    }
}
