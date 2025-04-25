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

    @Bean
    public NewTopic requestGetListDoctorByQuarter() {
        return TopicBuilder.name("request_get_list_doctor_by_quarter").build();
    }

    @Bean
    public NewTopic requestGetListDoctorByMonth() {
        return TopicBuilder.name("request_get_list_doctor_by_month").build();
    }

    @Bean
    public NewTopic requestGetListDoctorByYear() {
        return TopicBuilder.name("request_get_list_doctor_by_year").build();
    }
}
