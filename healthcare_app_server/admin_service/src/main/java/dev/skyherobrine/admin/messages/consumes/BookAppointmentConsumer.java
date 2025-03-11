package dev.skyherobrine.admin.messages.consumes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.admin.models.mongodb.BookAppointment;
import dev.skyherobrine.admin.repositories.mariadb.PatientRepository;
import dev.skyherobrine.admin.repositories.mongodb.BookAppointmentRepository;
import dev.skyherobrine.admin.repositories.mongodb.WorkScheduleRepository;
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
}

