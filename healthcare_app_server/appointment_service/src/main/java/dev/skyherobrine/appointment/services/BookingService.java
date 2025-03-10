package dev.skyherobrine.appointment.services;

import dev.skyherobrine.appointment.dtos.AppointmentDTO;
import dev.skyherobrine.appointment.enums.AppointmentStatus;
import dev.skyherobrine.appointment.feigns.UserFeign;
import dev.skyherobrine.appointment.feigns.WorkScheduleFeign;
import dev.skyherobrine.appointment.models.mongodb.Appointment;
import dev.skyherobrine.appointment.models.mongodb.BookAppointment;
import dev.skyherobrine.appointment.repositories.mongodb.AppointmentRepository;
import dev.skyherobrine.appointment.repositories.mongodb.BookAppointmentRepository;
import dev.skyherobrine.appointment.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class BookingService {

    private final KafkaTemplate<String,String> kafkaTemplate;
    private final AppointmentRepository ar;
    private final BookAppointmentRepository bar;
    private final AppointmentRepository appointmentRepository;
    private final UserFeign userFeign;
    private final WorkScheduleFeign workScheduleFeign;

    public BookingService(KafkaTemplate<String, String> kafkaTemplate, AppointmentRepository ar, BookAppointmentRepository bar, AppointmentRepository appointmentRepository, UserFeign userFeign, WorkScheduleFeign workScheduleFeign) {
        this.kafkaTemplate = kafkaTemplate;
        this.ar = ar;
        this.bar = bar;
        this.appointmentRepository = appointmentRepository;
        this.userFeign = userFeign;
        this.workScheduleFeign = workScheduleFeign;
    }

    public synchronized Map<String,Object> booking(AppointmentDTO appointmentDTO) throws Exception {
        log.info("Booking Service: add the book appointment");
        Map<String,Object> result = new HashMap<>();

        Appointment appointment = appointmentRepository.findByWorkScheduleId(appointmentDTO.getWorkSchedule()).orElse(null);

        if(appointment == null) {
            appointment = new Appointment(getMaxIdAppointment(), appointmentDTO.getWorkSchedule());
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

    public Map<String,Object> getAppointmentDetail(Long appointmentId) {
        Map<String,Object> result = new HashMap<>();
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow(() -> new EntityNotFoundException("Appointment was not found"));
        result.put("appointment", appointment);
        result.put("information", new HashMap<>(){{
            put("total_book", bar.countByAppointment_Id(appointmentId));
            put("total_book_without_cancel", bar.countByAppointment_IdAndStatusNot(appointmentId, AppointmentStatus.CANCELLED));
            put("waiting", bar.findByStatus(AppointmentStatus.WAITING));
            put("in_progress", bar.findByStatus(AppointmentStatus.IN_PROGRESS));
            put("done", bar.findByStatus(AppointmentStatus.DONE));
            put("cancelled", bar.findByStatus(AppointmentStatus.CANCELLED));
        }});
        result.put("work_schedule", workScheduleFeign.getWorkScheduleById(String.valueOf(appointment.getWorkScheduleId())).getBody().getData());
        result.put("patient_book", listPatientBookAppointment(appointmentId));
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

    private List<Object> listPatientBookAppointment(Long appointmentId) {
        List<Object> result = new ArrayList<>();

        bar.findByAppointment_Id(appointmentId).forEach(bookAppointment -> {
            result.add(userFeign.getPatientByUserId(bookAppointment.getPatientId()).getBody().getData());
        });

        return result;
    }
}
