package dev.skyherobrine.appointment.messages.producers.requests;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class WorkScheduleRequestProducer {

    @Bean
    public NewTopic requestGetWorkSchedule() {
        return TopicBuilder.name("request_get_work_schedule_by_between").build();
    }

    @Bean
    public NewTopic requestGetListWorkScheduleOrder() {
        return TopicBuilder.name("request_get_list_work_schedule_order").build();
    }

    @Bean
    public NewTopic requestVisualizeAppointmentByMonthly() {
        return TopicBuilder.name("request_visualize_appointment_by_monthly").build();
    }

    @Bean
    public NewTopic requestVisualizeAppointmentByYearly() {
        return TopicBuilder.name("request_visualize_appointment_by_yearly").build();
    }
}
