package dev.skyherobrine.appointment.messages.consumers.responses;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.appointment.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CountDownLatch;

@Component
@Slf4j
public class WorkScheduleResponseConsumer {

    private JsonNode node;
    private CountDownLatch latch = new CountDownLatch(1);

    @KafkaListener(topics = "response_get_work_schedule_by_between", groupId = "appointment_response_get_work_schedule_by_between")
    public void responseGetWorkScheduleByBetween(String message) throws Exception {
        log.info("Work Shedule Response Consumer: listen for getting the request");
        log.info("Work Schedule Response Consumer: {}", message);
        node = new ObjectMapper().readTree(message);
        latch.countDown();
    }

    @KafkaListener(topics = "response_get_list_work_schedule_order", groupId = "appointment_response_get_list_work_schedule_order")
    public void responseGetAllWorkScheduleOrder(String message) throws Exception {
        log.info("Work Schedule Response Consumer: listen for getting the request");
        log.info("Work Schedule Response Consumer: {}", message);
        node = new ObjectMapper().readTree(message);
        latch.countDown();
    }

    @KafkaListener(topics = "response_visualize_appointment_by_monthly", groupId = "appointment_response_visualize_appointment_by_monthly")
    public void responseVisualizeAppointmentByMonthly(String message) throws Exception {
        log.info("Work Schedule Response Consumer: listen for getting the request");
        log.info("Work Schedule Response Consumer: {}", message);
        node = new ObjectMapper().readTree(message);
        latch.countDown();
    }

    @KafkaListener(topics = "response_visualize_appointment_by_yearly", groupId = "appointment_response_visualize_appointment_by_yearly")
    public void responseVisualizeAppointmentByYearly(String message) throws Exception {
        log.info("Work Schedule Response Consumer: listen for getting the request");
        log.info("Work Schedule Response Consumer: {}", message);
        node = new ObjectMapper().readTree(message);
        latch.countDown();
    }

    @KafkaListener(topics = "response_get_today_work_schedule_by_doctor", groupId = "appointment_response_get_today_work_schedule_by_doctor")
    public void responseGetTodayWorkScheduleByDoctor(String message) throws Exception {
        log.info("Work Schedule Response Consumer: listen for getting the request");
        log.info("Work Schedule Response Consumer: {}", message);
        node = new ObjectMapper().readTree(message);
        latch.countDown();
    }

    @KafkaListener(topics = "response_get_work_schedule_by_doctor", groupId = "appointment_response_get_work_schedule_by_doctor")
    public void responseGetWorkScheduleByDoctor(String message) throws Exception {
        log.info("Work Schedule Response Consumer: listen for getting the request");
        log.info("Work Schedule Response Consumer: {}", message);
        node = new ObjectMapper().readTree(message);
        latch.countDown();
    }

    @KafkaListener(topics = "response_visualize_work_schedule_doctor_by_monthly", groupId = "appointment_response_visualize_work_schedule_doctor_by_monthly")
    public void responseVisualizeWorkScheduleDoctorByMonthly(String message) throws Exception {
        log.info("Work Schedule Response Consumer: listen for getting the request");
        log.info("Work Schedule Response Consumer: {}", message);
        node = new ObjectMapper().readTree(message);
        latch.countDown();
    }

    @KafkaListener(topics = "response_visualize_work_schedule_doctor_by_yearly", groupId = "appointment_response_visualize_work_schedule_doctor_by_yearly")
    public void responseVisualizeWorkScheduleDoctorByYearly(String message) throws Exception {
        log.info("Work Schedule Response Consumer: listen for getting the request");
        log.info("Work Schedule Response Consumer: {}", message);
        node = new ObjectMapper().readTree(message);
        latch.countDown();
    }

    public JsonNode getStorageData() {
        try {
            latch.await();
            latch = new CountDownLatch(1);
            return node;
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            return null;
        }
    }
}
