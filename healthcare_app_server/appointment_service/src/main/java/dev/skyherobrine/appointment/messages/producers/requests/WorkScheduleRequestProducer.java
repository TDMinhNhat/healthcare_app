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
}
