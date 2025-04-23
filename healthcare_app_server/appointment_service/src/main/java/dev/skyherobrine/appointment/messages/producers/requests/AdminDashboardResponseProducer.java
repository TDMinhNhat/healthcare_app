package dev.skyherobrine.appointment.messages.producers.requests;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class AdminDashboardResponseProducer {

    @Bean
    public NewTopic requestGetAdminDashboard() {
        return TopicBuilder.name("request_get_admin_dashboard").build();
    }
}
