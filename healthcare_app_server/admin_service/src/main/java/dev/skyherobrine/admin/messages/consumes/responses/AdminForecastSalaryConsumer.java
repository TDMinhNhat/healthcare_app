package dev.skyherobrine.admin.messages.consumes.responses;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.concurrent.CountDownLatch;

@Component
@Slf4j
public class AdminForecastSalaryConsumer {

    private CountDownLatch latch = new CountDownLatch(1);
    private JsonNode node;

    @KafkaListener(topics = "predict_salary_year_result", groupId = "admin_predict_salary_year_result")
    public void getResultForecastSalaryYear(String message) {
        try {
            log.info("Admin Forecast Salary Year Result: listen for getting the result forecast");
            log.info("Admin Forecast Salary Year Result: " + message);
            node = new ObjectMapper().readTree(message);
            latch.countDown();
        } catch (Exception e) {
            log.error("Admin Forecast Salary Year Result: The consumer thrown an exception");
            log.error(e.getMessage());
        }
    }

    public JsonNode getStorageData() {
        try {
            latch.await();
            latch = new CountDownLatch(1);
        } catch (InterruptedException e) {
            log.error("Admin Forecast Salary Year Result: The consumer thrown an exception");
            log.error(e.getMessage());
        }
        return node;
    }
}
