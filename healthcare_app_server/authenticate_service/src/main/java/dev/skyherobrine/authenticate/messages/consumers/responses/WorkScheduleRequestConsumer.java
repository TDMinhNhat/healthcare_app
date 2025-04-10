package dev.skyherobrine.authenticate.messages.consumers.responses;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.authenticate.models.mongodb.WorkSchedule;
import dev.skyherobrine.authenticate.repositories.mongodb.WorkScheduleRepository;
import dev.skyherobrine.authenticate.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Slf4j
public class WorkScheduleRequestConsumer {

    private final WorkScheduleRepository workScheduleRepository;
    private final KafkaTemplate<String,Object> kafkaTemplate;

    public WorkScheduleRequestConsumer(WorkScheduleRepository workScheduleRepository, KafkaTemplate<String, Object> kafkaTemplate) {
        this.workScheduleRepository = workScheduleRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "request_get_work_schedule_by_between", groupId = "authenticate_request_get_work_schedule_by_between")
    public void responseGetWorkScheduleByBetween(String message) {
        try {
            log.info("Work Schedule Request Consumer: listen for getting the request");
            log.info("Work Schedule Request Consumer: {}", message);
            JsonNode node = new ObjectMapper().readTree(message);
            String start = node.get("start").asText();
            String end = node.get("end").asText();

            List<WorkSchedule> result = workScheduleRepository.findByDateAppointmentBetween(
                    LocalDate.parse(start, DateTimeFormatter.ofPattern("dd-MM-yyyy")).minusDays(1L),
                    LocalDate.parse(end, DateTimeFormatter.ofPattern("dd-MM-yyyy")).plusDays(1L)
            );
            kafkaTemplate.send("response_get_work_schedule_by_between", ObjectParser.convertObjectToJson(result)).get();
            kafkaTemplate.flush();
            log.info("Work Schedule Request Consumer: sent the response");
        } catch (Exception e) {
            log.info("Work Schedule Request Consumer: error when getting the request");
            log.error("Work Schedule Request Consumer: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "request_get_list_work_schedule_order", groupId = "authenticate_request_get_list_work_schedule_order")
    public void responseGetListWorkScheduleOrder(String message) {
        try {
            log.info("Work Schedule Request Consumer: listen for getting the request");
            log.info("Work Schedule Request Consumer: {}", message);

            List<Object> list = ObjectParser.convertJsonToObject(message, List.class);
            List<Long> ids = list.stream().map(item -> Long.parseLong(item.toString())).toList();
            List<WorkSchedule> workSchedules = workScheduleRepository.findByIdInOrderByDateAppointmentDesc(ids);

            kafkaTemplate.send("response_get_list_work_schedule_order", ObjectParser.convertObjectToJson(workSchedules)).get();
            kafkaTemplate.flush();
            log.info("Work Schedule Request Consumer: sent the response");
        } catch (Exception e) {
            log.info("Work Schedule Request Consumer: error when getting the request");
            log.error("Work Schedule Request Consumer: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "request_visualize_appointment_by_monthly", groupId = "authenticate_request_visualize_appointment_by_monthly")
    public void responseVisualizeAppointmentByMonthly(String message) {
        try {
            log.info("Work Schedule Request Consumer: listen for getting the request");
            log.info("Work Schedule Request Consumer: {}", message);

            List<Integer> getListWorkScheduleId = ObjectParser.convertJsonToObject(message, List.class);
            List<WorkSchedule> result = workScheduleRepository.findByIdInOrderByDateAppointmentDesc(getListWorkScheduleId.stream().map(id -> Long.parseLong(id.toString())).toList()).stream().filter(workSchedule -> workSchedule.getDateAppointment().getYear() == LocalDate.now().getYear()).toList();

            Map<String,String> visualizeMonthly = new HashMap<>();
            for(AtomicInteger i = new AtomicInteger(1); i.get() <= 12; i.set(i.get() + 1)) {
                visualizeMonthly.put(i.get() + "", result.stream().filter(workSchedule -> workSchedule.getDateAppointment().getMonthValue() == i.get()).toList().size() + "");
            }

            kafkaTemplate.send("response_visualize_appointment_by_monthly", ObjectParser.convertObjectToJson(visualizeMonthly)).get();
            kafkaTemplate.flush();
        } catch (Exception e) {
            log.error("Work Schedule Request Consumer: error when getting the request");
            log.error("Work Schedule Request Consumer: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "request_visualize_appointment_by_yearly", groupId = "authenticate_request_visualize_appointment_by_yearly")
    public void responseVisualizeAppointmentByYearly(String message) {
        try {
            log.info("Work Schedule Request Consumer: listen for getting the request");
            log.info("Work Schedule Request Consumer: {}", message);

            List<Integer> getListWorkScheduleId = ObjectParser.convertJsonToObject(message, List.class);
            List<WorkSchedule> result = workScheduleRepository.findByIdInOrderByDateAppointmentDesc(getListWorkScheduleId.stream().map(id -> Long.parseLong(id.toString())).toList());

            Map<String,String> visualizeYearly = new HashMap<>();
            for(AtomicInteger i = new AtomicInteger(LocalDate.now().getYear()); i.get() >= LocalDate.now().minusYears(5L).getYear(); i.set(i.get() - 1)) {
                visualizeYearly.put(i.get() + "", result.stream().filter(workSchedule -> workSchedule.getDateAppointment().getYear() == i.get()).toList().size() + "");
            }

            kafkaTemplate.send("response_visualize_appointment_by_yearly", ObjectParser.convertObjectToJson(visualizeYearly)).get();
            kafkaTemplate.flush();

        } catch (Exception e) {
            log.error("Work Schedule Request Consumer: error when getting the request");
            log.error("Work Schedule Request Consumer: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "request_get_today_work_schedule_by_doctor", groupId = "authenticate_request_get_today_work_schedule_by_doctor")
    public void responseGetTodayWorkScheduleByDoctor(String message) {
        try {
            log.info("Work Schedule Request Consumer: listen for getting the request");
            log.info("Work Schedule Request Consumer: {}", message);

            String doctorId = ObjectParser.convertJsonToObject(message, String.class);
            List<Long> workSchedules = workScheduleRepository.findAllByDoctor_UserId(doctorId).stream().filter(workSchedule -> Objects.equals(workSchedule.getDateAppointment(), LocalDate.now())).map(WorkSchedule::getId).toList();

            kafkaTemplate.send("response_get_today_work_schedule_by_doctor", ObjectParser.convertObjectToJson(workSchedules)).get();
            kafkaTemplate.flush();

        } catch (Exception e) {
            log.error("Work Schedule Request Consumer: error when getting the request");
            log.error("Work Schedule Request Consumer: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "request_get_work_schedule_by_doctor", groupId = "authenticate_request_get_work_schedule_by_doctor")
    public void responseGetWorkScheduleByDoctor(String message) {
        try {
            log.info("Work Schedule Request Consumer: listen for getting the request");
            log.info("Work Schedule Request Consumer: {}", message);

            String doctorId = ObjectParser.convertJsonToObject(message, String.class);
            List<Long> workSchedules = workScheduleRepository.findAllByDoctor_UserId(doctorId).stream().map(WorkSchedule::getId).toList();

            kafkaTemplate.send("response_get_work_schedule_by_doctor", ObjectParser.convertObjectToJson(workSchedules)).get();
            kafkaTemplate.flush();
        } catch (Exception e) {
            log.error("Work Schedule Request Consumer: error when getting the request");
            log.error("Work Schedule Request Consumer: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "request_visualize_work_schedule_doctor_by_monthly", groupId = "authenticate_request_visualize_work_schedule_doctor_by_monthly")
    public void responseVisualizeWorkScheduleDoctorByMonthly(String message) {
        try {
            log.info("Work Schedule Request Consumer: listen for getting the request");
            log.info("Work Schedule Request Consumer: {}", message);

            String doctorId = ObjectParser.convertJsonToObject(message, String.class);
            List<WorkSchedule> result = workScheduleRepository.findAllByDoctor_UserId(doctorId).stream().filter(workSchedule -> workSchedule.getDateAppointment().getYear() == LocalDate.now().getYear()).toList();

            Map<String,Object> visualizeMonthly = new HashMap<>();
            for(AtomicInteger i = new AtomicInteger(1); i.get() <= 12; i.set(i.get() + 1)) {
                visualizeMonthly.put(i.get() + "", result.stream().filter(workSchedule -> workSchedule.getDateAppointment().getMonthValue() == i.get()).map(WorkSchedule::getId).toList());
            }

            kafkaTemplate.send("response_visualize_work_schedule_doctor_by_monthly", ObjectParser.convertObjectToJson(visualizeMonthly)).get();
            kafkaTemplate.flush();
        } catch (Exception e) {
            log.error("Work Schedule Request Consumer: error when getting the request");
            log.error("Work Schedule Request Consumer: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "request_visualize_work_schedule_doctor_by_yearly", groupId = "authenticate_request_visualize_work_schedule_doctor_by_yearly")
    public void responseVisualizeWorkScheduleDoctorByYearly(String message) {
        try {
            log.info("Work Schedule Request Consumer: listen for getting the request");
            log.info("Work Schedule Request Consumer: {}", message);

            String doctorId = ObjectParser.convertJsonToObject(message, String.class);
            List<WorkSchedule> result = workScheduleRepository.findAllByDoctor_UserId(doctorId).stream().filter(workSchedule -> workSchedule.getDateAppointment().getYear() == LocalDate.now().getYear()).toList();

            Map<String,Object> visualizeYearly = new HashMap<>();
            for(AtomicInteger i = new AtomicInteger(LocalDate.now().getYear()); i.get() >= LocalDate.now().minusYears(5L).getYear(); i.set(i.get() - 1)) {
                visualizeYearly.put(i.get() + "", result.stream().filter(workSchedule -> workSchedule.getDateAppointment().getYear() == i.get()).map(WorkSchedule::getId).toList());
            }

            kafkaTemplate.send("response_visualize_work_schedule_doctor_by_yearly", ObjectParser.convertObjectToJson(visualizeYearly)).get();
            kafkaTemplate.flush();
        } catch (Exception e) {
            log.error("Work Schedule Request Consumer: error when getting the request");
            log.error("Work Schedule Request Consumer: {}", e.getMessage());
        }
    }
}
