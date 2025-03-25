package dev.skyherobrine.appointment.messages.producers;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Component;

@Component
public class BookAppointmentProducer {

    @Bean
    public NewTopic addBookAppointment() {
        return TopicBuilder.name("insert_book_appointment").build();
    }

    @Bean
    public NewTopic cancelBookAppointment() {
        return TopicBuilder.name("cancel_appointment").build();
    }
}
