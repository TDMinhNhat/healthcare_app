package dev.skyherobrine.admin.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class DoctorProducer {

    @Bean
    public NewTopic insertDoctor() {
        return TopicBuilder.name("insert_doctor").build();
    }

    @Bean
    public NewTopic insertDoctorCertificate() {
        return TopicBuilder.name("insert_doctor_certificate").build();
    }

    @Bean
    public NewTopic insertDoctorEducation() {
        return TopicBuilder.name("insert_doctor_education").build();
    }

    @Bean
    public NewTopic insertDoctorExperience() {
        return TopicBuilder.name("insert_doctor_experience").build();
    }

    @Bean
    public NewTopic updateDoctorCertificate() {
        return TopicBuilder.name("update_doctor_certificate").build();
    }

    @Bean
    public NewTopic updateDoctorEducation() {
        return TopicBuilder.name("update_doctor_education").build();
    }

    @Bean
    public NewTopic updateDoctorExperience() {
        return TopicBuilder.name("update_doctor_experience").build();
    }

    @Bean
    public NewTopic deleteDoctor() {
        return TopicBuilder.name("delete_doctor").build();
    }
}
