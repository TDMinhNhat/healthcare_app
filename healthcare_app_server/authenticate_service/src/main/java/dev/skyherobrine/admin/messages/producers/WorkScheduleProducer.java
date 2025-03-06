package dev.skyherobrine.admin.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class WorkScheduleProducer {

    @Bean
    public NewTopic insertWorkSchedule() {
        return TopicBuilder.name("insert_work_schedule").build();
    }

    @Bean
    public NewTopic deleteWorkSchedule() {
        return TopicBuilder.name("delete_work_schedule").build();
    }
}
