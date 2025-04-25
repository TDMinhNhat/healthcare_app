package dev.skyherobrine.appointment.messages.consumers.responses;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.concurrent.CountDownLatch;

@Component
@Slf4j
public class AdminDashboardResponseConsumer {

    private JsonNode node;
    private CountDownLatch latch = new CountDownLatch(1);

    @KafkaListener(topics = "response_get_admin_dashboard", groupId = "appointment_response_get_admin_dashboard")
    public void responseGetAdminDashboard(String message) {
        try {
            log.info("Admin Dashboard Response Consumer: listening for getting admin dashboard");
            log.info("Admin Dashboard Response Consumer: {}", message);
            node = new ObjectMapper().readTree(message);
        } catch (Exception e) {
            log.error("Admin Dashboard Response Consumer: the consumer thrown an error");
            log.error(e.getMessage());
        }
        latch.countDown();
    }

    @KafkaListener(topics = "response_get_list_doctor_by_quarter", groupId = "appointment_response_get_list_doctor_by_quarter")
    public void responseGetListDoctorByQuarter(String message) {
        try {
            log.info("Admin Dashboard Response Consumer: listening for getting list doctor by quarter");
            log.info("Admin Dashboard Response Consumer: {}", message);
            node = new ObjectMapper().readTree(message);
        } catch (Exception e) {
            log.error("Admin Dashboard Response Consumer: the consumer thrown an error");
            log.error(e.getMessage());
        }
        latch.countDown();
    }

    @KafkaListener(topics = "response_get_list_doctor_by_month", groupId = "appointment_response_get_list_doctor_by_month")
    public void responseGetListDoctorByMonth(String message) {
        try {
            log.info("Admin Dashboard Response Consumer: listening for getting list doctor by month");
            log.info("Admin Dashboard Response Consumer: {}", message);
            node = new ObjectMapper().readTree(message);
        } catch (Exception e) {
            log.error("Admin Dashboard Response Consumer: the consumer thrown an error");
            log.error(e.getMessage());
        }
        latch.countDown();
    }

    @KafkaListener(topics = "response_get_list_doctor_by_year", groupId = "appointment_response_get_list_doctor_by_year")
    public void responseGetListDoctorByYear(String message) {
        try {
            log.info("Admin Dashboard Response Consumer: listening for getting list doctor by year");
            log.info("Admin Dashboard Response Consumer: {}", message);
            node = new ObjectMapper().readTree(message);
        } catch (Exception e) {
            log.error("Admin Dashboard Response Consumer: the consumer thrown an error");
            log.error(e.getMessage());
        }
        latch.countDown();
    }

    public synchronized JsonNode getStorageData() {
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
