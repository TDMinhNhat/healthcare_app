package dev.skyherobrine.admin.messages.consumes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.admin.enums.AppointmentStatus;
import dev.skyherobrine.admin.models.mongodb.BookAppointment;
import dev.skyherobrine.admin.repositories.mariadb.PatientRepository;
import dev.skyherobrine.admin.repositories.mongodb.BookAppointmentRepository;
import dev.skyherobrine.admin.repositories.mongodb.WorkScheduleRepository;
import dev.skyherobrine.admin.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class BookAppointmentConsumer {

    private final PatientRepository patientRepository;
    private final BookAppointmentRepository bookAppointmentRepository;
    private final WorkScheduleRepository workScheduleRepository;

    public BookAppointmentConsumer(PatientRepository patientRepository, BookAppointmentRepository bookAppointmentRepository, WorkScheduleRepository workScheduleRepository) {
        this.patientRepository = patientRepository;
        this.bookAppointmentRepository = bookAppointmentRepository;
        this.workScheduleRepository = workScheduleRepository;
    }

    @KafkaListener(topics = "insert_book_appointment", groupId = "admin_insert_book_appointment")
    public void insertBookAppointment(String message) {
        try {
            log.info("Book Appointment Consumer: listen the message for inserting the book appointment");
            log.info("Book Appointment Consumer: {}", message);

            JsonNode node = new ObjectMapper().readTree(message);
            Long getId = node.get("id").asLong();
            String getPatientId = node.get("patientId").asText();
            Long getWorkSchedule = node.get("workSchedule").asLong();
            int getNumericOrders = node.get("numericalOrder").asInt();
            String getNote = node.get("note").asText();

            BookAppointment bookAppointment = new BookAppointment(
                    getId,
                    patientRepository.findPatientByUserId(getPatientId).orElseThrow(() -> new EntityNotFoundException("Patient was not found")),
                    workScheduleRepository.findById(getWorkSchedule).orElseThrow(() -> new EntityNotFoundException("Work Schedule was not found")),
                    getNumericOrders,
                    getNote
            );
            bookAppointmentRepository.save(bookAppointment);
            log.info("Book Appointment Consumer: The book appointment has been inserted");
        } catch (Exception e) {
            log.error("Book Appointment Consumer: The consumer thrown an exception");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "cancel_appointment", groupId = "admin_cancel_bookAppointment")
    public void cancelBookAppointment(String message) {
        try {
            log.info("Book Appointment Consumer: listen the message for canceling the book appointment");
            log.info("Book Appointment Consumer: {}", message);

            String getBookAppointmentId = ObjectParser.convertJsonToObject(message, String.class);
            BookAppointment target = bookAppointmentRepository.findById(Long.parseLong(getBookAppointmentId)).orElseThrow(() -> new EntityNotFoundException("The book appointment was not found!"));
            target.setStatus(AppointmentStatus.CANCELLED);
            bookAppointmentRepository.save(target);
            log.info("Book Appointment Consumer: set cancel the book appointment successfully!");
        } catch (Exception e) {
            log.error("Book Appointment Consumer: The consumer thrown an exception");
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "update_status_bookAppointment", groupId = "admin_update_status_bookAppointment")
    public void updateStatusBookAppointment(String message) {
        try {
            log.info("Book Appointment Consumer: listen the message for updating status of the book appointment");
            log.info("Book Appointment Consumer: {}", message);

            JsonNode node = new ObjectMapper().readTree(message);
            String getAppointmentId = node.get("data").get("currentPatient").get("scheduleId").asText();
            String getUserId = node.get("data").get("currentPatient").get("userId").asText();
            String getStatus = node.get("status").asText();

            BookAppointment target = bookAppointmentRepository.findByPatient_UserIdAndWorkSchedule_Id(getUserId, Long.parseLong(getAppointmentId)).orElseThrow(() -> new EntityNotFoundException("The book appointment was not found!"));
            target.setStatus(AppointmentStatus.valueOf(getStatus));
            bookAppointmentRepository.save(target);

            log.info("Book Appointment Consumer: update the status successfully!");
        } catch (Exception e) {
            log.error("Book Appointment Consumer: the consumer thrown an error");
            log.error(e.getMessage());
        }
    }
}

