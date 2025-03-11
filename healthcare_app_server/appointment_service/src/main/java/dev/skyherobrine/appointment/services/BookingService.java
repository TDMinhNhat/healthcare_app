package dev.skyherobrine.appointment.services;

import dev.skyherobrine.appointment.dtos.AppointmentDTO;
import dev.skyherobrine.appointment.enums.AppointmentStatus;
import dev.skyherobrine.appointment.feigns.UserFeign;
import dev.skyherobrine.appointment.feigns.WorkScheduleFeign;
import dev.skyherobrine.appointment.models.mongodb.BookAppointment;
import dev.skyherobrine.appointment.repositories.mongodb.BookAppointmentRepository;
import dev.skyherobrine.appointment.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class BookingService {

    private final KafkaTemplate<String,String> kafkaTemplate;
    private final BookAppointmentRepository bar;
    private final UserFeign userFeign;
    private final WorkScheduleFeign workScheduleFeign;

    public BookingService(KafkaTemplate<String, String> kafkaTemplate, BookAppointmentRepository bar, UserFeign userFeign, WorkScheduleFeign workScheduleFeign) {
        this.kafkaTemplate = kafkaTemplate;
        this.bar = bar;
        this.userFeign = userFeign;
        this.workScheduleFeign = workScheduleFeign;
    }

    public synchronized Map<String,Object> booking(AppointmentDTO appointmentDTO) throws Exception {
        log.info("Booking Service: add the book appointment");
        Map<String,Object> result = new HashMap<>();

        BookAppointment bookAppointment = new BookAppointment(
                getMaxIdBookAppointment(),
                appointmentDTO.getPatientId(),
                appointmentDTO.getWorkSchedule(),
                getNumericalOrders(appointmentDTO.getWorkSchedule()),
                appointmentDTO.getNote()
        );
        kafkaTemplate.send("insert_book_appointment", ObjectParser.convertObjectToJson(bookAppointment));
        bar.save(bookAppointment);

        result.put("book_appointment", bookAppointment);

        return result;
    }

    public Map<String,Object> getAppointmentDetail(Long workSchedule) {
        Map<String,Object> result = new HashMap<>();
        result.put("information", new HashMap<>(){{
            put("total_book", bar.countByWorkSchedule(workSchedule));
            put("total_book_without_cancel", bar.countByWorkScheduleAndStatusNot(workSchedule, AppointmentStatus.CANCELLED));
            put("waiting", bar.findByStatus(AppointmentStatus.WAITING));
            put("in_progress", bar.findByStatus(AppointmentStatus.IN_PROGRESS));
            put("done", bar.findByStatus(AppointmentStatus.DONE));
            put("cancelled", bar.findByStatus(AppointmentStatus.CANCELLED));
        }});
        result.put("work_schedule", workScheduleFeign.getById(workSchedule).getBody().getData());
        result.put("patient_book", listPatientBookAppointment(workSchedule));
        return result;
    }

    private Long getMaxIdBookAppointment() {
        BookAppointment bookAppointment = bar.findTopByOrderByIdDesc().orElse(null);
        return (bookAppointment == null ? 0 : bookAppointment.getId()) + 1;
    }

    private int getNumericalOrders(Long workSchedule) {
        BookAppointment target = bar.findFirstByWorkScheduleOrderByNumericalOrderDesc(workSchedule).orElse(null);
        return (target == null ? 0 : target.getNumericalOrder()) + 1;
    }

    private List<Object> listPatientBookAppointment(Long workSchedule) {
        List<Object> result = new ArrayList<>();

        bar.findByWorkSchedule(workSchedule).forEach(bookAppointment -> {
            result.add(userFeign.getPatientByUserId(bookAppointment.getPatientId()).getBody().getData());
        });

        return result;
    }
}
