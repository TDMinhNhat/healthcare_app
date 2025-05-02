package dev.skyherobrine.appointment.messages.consumers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.appointment.enums.AppointmentStatus;
import dev.skyherobrine.appointment.enums.PaymentStatus;
import dev.skyherobrine.appointment.models.mongodb.BookAppointment;
import dev.skyherobrine.appointment.models.mongodb.BookAppointmentPayment;
import dev.skyherobrine.appointment.repositories.mongodb.BookAppointmentPaymentRepository;
import dev.skyherobrine.appointment.repositories.mongodb.BookAppointmentRepository;
import dev.skyherobrine.appointment.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class BookAppointmentConsumer {

    private final BookAppointmentRepository bookAppointmentRepository;
    private final BookAppointmentPaymentRepository bookAppointmentPaymentRepository;

    public BookAppointmentConsumer(BookAppointmentRepository bookAppointmentRepository, BookAppointmentPaymentRepository bookAppointmentPaymentRepository) {
        this.bookAppointmentRepository = bookAppointmentRepository;
        this.bookAppointmentPaymentRepository = bookAppointmentPaymentRepository;
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
            BookAppointment result = bookAppointmentRepository.save(target);

            BookAppointmentPayment bookAppointmentPayment = bookAppointmentPaymentRepository.findByBookAppointmentId_Id(target.getId()).orElseThrow(() -> new EntityNotFoundException("The book appointment payment was not found!"));
            bookAppointmentPayment.setBookAppointmentId(result);
            bookAppointmentPaymentRepository.save(bookAppointmentPayment);

            log.info("Book Appointment Consumer: update the status successfully!");
        } catch (Exception e) {
            log.error("Book Appointment Consumer: the consumer thrown an error");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "assign_payback", groupId = "appointment_assign_payback")
    public void assignPayback(String message) {
        try {
            log.info("Book Appointment Consumer: listen the message for assigning payback");
            log.info("Book Appointment Consumer: {}", message);

            String getBookAppointmentId = ObjectParser.convertJsonToObject(message, String.class);
            BookAppointment bookAppointment = bookAppointmentRepository.findById(Long.parseLong(getBookAppointmentId)).orElse(null);
            if(bookAppointment != null) {
                BookAppointmentPayment bookAppointmentPayment = bookAppointmentPaymentRepository.findByBookAppointmentId_Id(bookAppointment.getId()).orElse(null);
                if(bookAppointmentPayment != null) {
                    bookAppointmentPayment.setStatus(PaymentStatus.PAY_BACK);
                    bookAppointmentPaymentRepository.save(bookAppointmentPayment);
                    log.info("Book Appointment Consumer: assign payback successfully!");
                    return;
                }
                log.warn("Book Appointment Consumer: can't found the book appointment payment!");
            }
            log.warn("Book Appointment Consumer: can't found the book appointment!");
        } catch (Exception e) {
            log.error("Book Appointment Consumer: the consumer thrown an error");
            log.error(e.getMessage());
        }
    }
}
