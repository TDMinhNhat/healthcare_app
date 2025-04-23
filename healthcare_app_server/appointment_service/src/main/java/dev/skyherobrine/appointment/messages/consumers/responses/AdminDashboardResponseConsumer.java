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
