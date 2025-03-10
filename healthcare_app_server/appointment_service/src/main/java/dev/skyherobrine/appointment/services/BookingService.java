package dev.skyherobrine.appointment.services;

import dev.skyherobrine.appointment.dtos.AppointmentDTO;
import dev.skyherobrine.appointment.models.mongodb.Appointment;
import dev.skyherobrine.appointment.models.mongodb.BookAppointment;
import dev.skyherobrine.appointment.repositories.mongodb.AppointmentRepository;
import dev.skyherobrine.appointment.repositories.mongodb.BookAppointmentRepository;
import dev.skyherobrine.appointment.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class BookingService {

    private final KafkaTemplate<String,String> kafkaTemplate;
    private final AppointmentRepository ar;
    private final BookAppointmentRepository bar;
    private final AppointmentRepository appointmentRepository;

    public BookingService(KafkaTemplate<String, String> kafkaTemplate, AppointmentRepository ar, BookAppointmentRepository bar, AppointmentRepository appointmentRepository) {
        this.kafkaTemplate = kafkaTemplate;
        this.ar = ar;
        this.bar = bar;
        this.appointmentRepository = appointmentRepository;
    }

    public synchronized Map<String,Object> booking(AppointmentDTO appointmentDTO) throws Exception {
        log.info("Booking Service: add the book appointment");
        Map<String,Object> result = new HashMap<>();

        Appointment appointment = appointmentRepository.findByDateAppointment(LocalDate.parse(appointmentDTO.getDateAppointment(), DateTimeFormatter.ofPattern("dd-MM-yyyy")))
                .orElse(null);

        if(appointment == null) {
            appointment = new Appointment(getMaxIdAppointment(), appointmentDTO.getWorkSchedule(), LocalDate.parse(appointmentDTO.getDateAppointment(), DateTimeFormatter.ofPattern("dd-MM-yyyy")));
            Appointment target = appointmentRepository.save(appointment);
            kafkaTemplate.send("insert_appointment", ObjectParser.convertObjectToJson(appointmentDTO));
            result.put("appointment", target);
        } else result.put("appointment", appointment);

        Thread.sleep(1000);

        BookAppointment bookAppointment = new BookAppointment(
                getMaxIdBookAppointment(),
                appointmentDTO.getPatientId(),
                appointment,
                getNumericalOrders(String.valueOf(appointment.getId())),
                appointmentDTO.getNote()
        );
        kafkaTemplate.send("insert_book_appointment", ObjectParser.convertObjectToJson(bookAppointment));
        bar.save(bookAppointment);

        result.put("book_appointment", bookAppointment);

        return result;
    }

    private Long getMaxIdAppointment() {
        Appointment appointment = ar.findFirstByOrderByIdDesc().orElse(null);
        return (appointment == null ? 0 : appointment.getId()) + 1;
    }

    private Long getMaxIdBookAppointment() {
        BookAppointment bookAppointment = bar.findTopByOrderByIdDesc().orElse(null);
        return (bookAppointment == null ? 0 : bookAppointment.getId()) + 1;
    }

    private int getNumericalOrders(String appointmentId) {
        BookAppointment target = bar.findFirstByAppointmentIdOrderByNumericalOrderDesc(appointmentId).orElse(null);
        return target == null ? 0 : target.getNumericalOrder();
    }
}
