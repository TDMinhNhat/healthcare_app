package dev.skyherobrine.admin.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class AdminDashboardProducer {

    @Bean
    public NewTopic predictSalaryQuarter() {
        return TopicBuilder.name("predict_salary_quarter").build();
    }

    @Bean
    public NewTopic predictSalaryMonth() {
        return TopicBuilder.name("predict_salary_month").build();
    }

    @Bean
    public NewTopic predictSalaryYear() {
        return TopicBuilder.name("predict_salary_year").build();
    }
}
