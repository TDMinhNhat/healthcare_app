package dev.skyherobrine.appointment.messages.consumers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.appointment.enums.AppointmentStatus;
import dev.skyherobrine.appointment.models.mongodb.BookAppointment;
import dev.skyherobrine.appointment.repositories.mongodb.BookAppointmentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class BookAppointmentConsumer {

    private final BookAppointmentRepository bookAppointmentRepository;

    public BookAppointmentConsumer(BookAppointmentRepository bookAppointmentRepository) {
        this.bookAppointmentRepository = bookAppointmentRepository;
    }

    @KafkaListener(topics = "update_status_bookAppointment", groupId = "appointment_update_status_bookAppointment")
    public void updateStatusBookAppointment(String message) {
        try {
            log.info("Book Appointment Consumer: listen the message for updating status of the book appointment");
            log.info("Book Appointment Consumer: {}", message);
            JsonNode node = new ObjectMapper().readTree(message);
            String getAppointmentId = node.get("data").get("currentPatient").get("scheduleId").asText();
            String getUserId = node.get("data").get("currentPatient").get("userId").asText();
            String getStatus = node.get("status").asText();

            BookAppointment target = bookAppointmentRepository.findByPatientIdAndWorkSchedule(getUserId, Long.parseLong(getAppointmentId)).orElseThrow(() -> new EntityNotFoundException("The book appointment was not found!"));
            target.setStatus(AppointmentStatus.valueOf(getStatus));
            bookAppointmentRepository.save(target);

            log.info("Book Appointment Consumer: update the status successfully!");
        } catch (Exception e) {
            log.error("Book Appointment Consumer: the consumer thrown an error");
            log.error(e.getMessage());
        }
    }
}
