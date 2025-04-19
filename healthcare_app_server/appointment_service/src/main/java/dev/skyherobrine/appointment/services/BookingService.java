package dev.skyherobrine.appointment.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.appointment.dtos.AppointmentDTO;
import dev.skyherobrine.appointment.enums.AppointmentStatus;
import dev.skyherobrine.appointment.enums.PaymentStatus;
import dev.skyherobrine.appointment.feigns.UserFeign;
import dev.skyherobrine.appointment.feigns.WorkScheduleFeign;
import dev.skyherobrine.appointment.messages.consumers.responses.WorkScheduleResponseConsumer;
import dev.skyherobrine.appointment.models.mongodb.BookAppointment;
import dev.skyherobrine.appointment.models.mongodb.BookAppointmentPayment;
import dev.skyherobrine.appointment.repositories.mongodb.BookAppointmentPaymentRepository;
import dev.skyherobrine.appointment.repositories.mongodb.BookAppointmentRepository;
import dev.skyherobrine.appointment.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Service
@Slf4j
public class BookingService {

    private final KafkaTemplate<String,String> kafkaTemplate;
    private final BookAppointmentRepository bar;
    private final BookAppointmentPaymentRepository bapr;
    private final UserFeign userFeign;
    private final WorkScheduleFeign workScheduleFeign;
    private final BookAppointmentRepository bookAppointmentRepository;
    private final WorkScheduleResponseConsumer workScheduleResponseConsumer;

    public BookingService(KafkaTemplate<String, String> kafkaTemplate, BookAppointmentRepository bar, BookAppointmentPaymentRepository bapr, UserFeign userFeign, WorkScheduleFeign workScheduleFeign, BookAppointmentRepository bookAppointmentRepository, WorkScheduleResponseConsumer workScheduleResponseConsumer) {
        this.kafkaTemplate = kafkaTemplate;
        this.bar = bar;
        this.bapr = bapr;
        this.userFeign = userFeign;
        this.workScheduleFeign = workScheduleFeign;
        this.bookAppointmentRepository = bookAppointmentRepository;
        this.workScheduleResponseConsumer = workScheduleResponseConsumer;
    }

    public synchronized Map<String,Object> booking(AppointmentDTO appointmentDTO) throws Exception {
        log.info("Booking Service: add the book appointment");
        Map<String,Object> result = new HashMap<>();

        if(bar.findByPatientIdAndWorkScheduleAndStatus(appointmentDTO.getPatientId(), appointmentDTO.getWorkSchedule(), AppointmentStatus.WAITING).isPresent()) {
            throw new Exception("You have already booked an appointment for this schedule");
        }

        BookAppointment bookAppointment = new BookAppointment(
                getMaxIdBookAppointment(),
                appointmentDTO.getPatientId(),
                appointmentDTO.getWorkSchedule(),
                getNumericalOrders(appointmentDTO.getWorkSchedule()),
                appointmentDTO.getNote()
        );
        kafkaTemplate.send("insert_book_appointment", ObjectParser.convertObjectToJson(bookAppointment));
        BookAppointment target = bar.save(bookAppointment);

        Thread.sleep(2000);

        BookAppointmentPayment bookAppointmentPayment = new BookAppointmentPayment(
                getMaxIdBookAppointmentPayment(),
                5000.0,
                appointmentDTO.getPaymentContent(),
                PaymentStatus.PAYED,
                target
        );
        kafkaTemplate.send("insert_book_appointment_payment", ObjectParser.convertObjectToJson(bookAppointmentPayment));

        result.put("book_appointment", bapr.save(bookAppointmentPayment));
        return result;
    }

    public Map<String,Object> getAppointmentDetail(Long workSchedule) {
        log.info("Booking Service: Get the appointment detail");
        Map<String,Object> result = new HashMap<>();
        result.put("information", new HashMap<>(){{
            put("total_book", bar.findByWorkSchedule(workSchedule).size());
            put("total_book_without_cancel", bar.findByWorkScheduleAndStatusNot(workSchedule, AppointmentStatus.CANCELLED).size());
            put("waiting", bar.findByStatus(AppointmentStatus.WAITING).size());
            put("in_progress", bar.findByStatus(AppointmentStatus.IN_PROGRESS).size());
            put("done", bar.findByStatus(AppointmentStatus.DONE).size());
            put("cancelled", bar.findByStatus(AppointmentStatus.CANCELLED).size());
        }});
        result.put("work_schedule", workScheduleFeign.getById(workSchedule).getBody().getData());
        result.put("patient_book", listPatientBookAppointment(workSchedule));
        return result;
    }

    public List<?> getAppointmentByPatientInWeek(String patientId, String start, String end) {
        try {
            log.info("Booking Service: Get the appointments by patient in week");
            List<Map<String,Object>> result = new ArrayList<>();
            kafkaTemplate.send("request_get_work_schedule_by_between", "{" +
                    "\"start\":\"" + start + "\"," +
                    "\"end\":\"" + end + "\"" +
                    "}");
            log.info("Booking Service: Sent the request get work schedule by between");

            JsonNode nodes = workScheduleResponseConsumer.getStorageData();
            log.info("Booking Service: Received the response from work schedule service");

            for(JsonNode node : nodes) {
                BookAppointment target = bar.findByPatientIdAndWorkSchedule(patientId, node.get("id").asLong()).orElse(null);
                if(target != null) {
                    Map<String,Object> map = new HashMap<>();
                    map.put("work_schedule", node);
                    map.put("book_appointment", target);
                    result.add(map);
                }
            }
            return result;
        } catch (Exception e) {
            log.error("Booking Service: The service return an error");
            log.error(e.getMessage());
            return null;
        }
    }

    private Long getMaxIdBookAppointment() {
        BookAppointment bookAppointment = bar.findTopByOrderByIdDesc().orElse(null);
        return (bookAppointment == null ? 0 : bookAppointment.getId()) + 1;
    }

    private Long getMaxIdBookAppointmentPayment() {
        BookAppointmentPayment bookAppointmentPayment = bapr.findTopByOrderByIdDesc().orElse(null);
        return (bookAppointmentPayment == null ? 0 : bookAppointmentPayment.getId()) + 1;
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
