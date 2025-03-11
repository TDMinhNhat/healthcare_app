package dev.skyherobrine.appointment.messages.consumers.responses;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.appointment.utils.ObjectParser;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CountDownLatch;

@Component
public class WorkScheduleResponseConsumer {

    private JsonNode node;
    private final CountDownLatch latch = new CountDownLatch(1);

    @KafkaListener(topics = "response_get_work_schedule_by_between", groupId = "appointment_response_get_work_schedule_by_between")
    public void responseGetWorkScheduleByBetween(String message) throws Exception {
        node = new ObjectMapper().readTree(message);
        latch.countDown();
    }

    public JsonNode getStorageData() {
        try {
            latch.await();
            return node;
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            return null;
        }
    }
}
