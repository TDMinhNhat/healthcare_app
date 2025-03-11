package dev.skyherobrine.appointment.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.stream.Stream;

@Service
@Slf4j
public class BookingService {

    private final KafkaTemplate<String,String> kafkaTemplate;
    private final BookAppointmentRepository bar;
    private final UserFeign userFeign;
    private final WorkScheduleFeign workScheduleFeign;
    private final BookAppointmentRepository bookAppointmentRepository;

    public BookingService(KafkaTemplate<String, String> kafkaTemplate, BookAppointmentRepository bar, UserFeign userFeign, WorkScheduleFeign workScheduleFeign, BookAppointmentRepository bookAppointmentRepository) {
        this.kafkaTemplate = kafkaTemplate;
        this.bar = bar;
        this.userFeign = userFeign;
        this.workScheduleFeign = workScheduleFeign;
        this.bookAppointmentRepository = bookAppointmentRepository;
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

    public List<BookAppointment> getAppointmentByPatientInWeek(String patientId, String start, String end) {
       List<Integer> ids = (List<Integer>) workScheduleFeign.getWorkScheduleByBetweenDate(start, end).getBody().getData();
       var stringId = ids.stream().map(String::valueOf).toList();

       List<BookAppointment> result = new ArrayList<>();
         for (String id : stringId) {
              BookAppointment target = bar.findByPatientIdAndWorkSchedule(patientId, Long.parseLong(id)).orElse(null);
              if(target != null) {
                  result.add(target);
              }
         }

       return result;
    }

//    public List<Map<String,Object>> getAppointmentByPatientInWeek(String patientId, String start, String end) {
//        try {
//            List<Map<String,Object>> result = new ArrayList<>();
//            Stream.of(workScheduleFeign.getWorkScheduleByBetweenDate(start, end).getBody().getData()).forEach(target -> {
//                try {
//                    String json = convertToValidJson(target.toString());
//                    System.out.println(json);
//                    JsonNode node = new ObjectMapper().readTree(json);
//
//                    for(JsonNode item : node) {
//                        Long workSchedule = item.get("id").asLong();
//                        BookAppointment bookAppointment = bar.findByPatientIdAndWorkSchedule(patientId, workSchedule).orElse(null);
//
//                        Map<String,Object> data = new HashMap<>();
//                        data.put("work_schedule", item);
//                        data.put("book_appointment", bookAppointment);
//                        result.add(data);
//                    }
//                } catch (Exception e) {
//                    log.error("Booking Service: The service working with JsonNode was return an error");
//                    log.error(e.getMessage());
//                }
//            });
//
//            return result;
//        } catch (Exception e) {
//            log.error("Booking Service: The service return an error");
//            log.error(e.getMessage());
//
//            return null;
//        }
//    }

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

    private String convertToValidJson(String input) {
//        // Replace `=` with `:` and ensure keys are wrapped in double quotes.
//        input = input.replaceAll("([a-zA-Z0-9_]+)=([a-zA-Z0-9_]+)", "\"$1\":\"$2\"");
//        input = input.replaceAll("([a-zA-Z0-9_]+)=null", "\"$1\":null");
//        input = input.replaceAll("([a-zA-Z0-9_]+)=(true|false)", "\"$1\":$2");
//        input = input.replaceAll("([a-zA-Z0-9_]+)=([0-9]+)", "\"$1\":$2");
//        return input.replaceAll("([a-zA-Z0-9_]+)=(\"[^\"]*\")", "\"$1\":$2");
        input = input.replaceAll("([a-zA-Z]+)=", "\"$1\":");
        input = input.replaceAll(":([^\\p{L}])+,", ":\"$1\",");
        input = input.replaceAll(":\"[0-9]+\"", ":$1");
        input = input.replaceAll("\"null\"", "null");
        input = input.replaceAll("\"true\"", "true");
        input = input.replaceAll("\"false\"", "false");

        return input;
    }
}
