package dev.skyherobrine.admin.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class AppointmentProducer {

    @Bean
    public NewTopic bookingAppointment() {
        return TopicBuilder.name("insert_appointment").build();
    }

    @Bean
    public NewTopic updateCancelAppointment() {
        return TopicBuilder.name("update_cancel_appointment").build();
    }
}
