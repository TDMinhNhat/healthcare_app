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
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

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
                    LocalDate.parse(start, DateTimeFormatter.ofPattern("dd-MM-yyyy")),
                    LocalDate.parse(end, DateTimeFormatter.ofPattern("dd-MM-yyyy"))
            );
            kafkaTemplate.send("response_get_work_schedule_by_between", ObjectParser.convertObjectToJson(result)).get();
            kafkaTemplate.flush();
            log.info("Work Schedule Request Consumer: sent the response");
        } catch (Exception e) {
            log.info("Work Schedule Request Consumer: error when getting the request");
            e.printStackTrace();
        }
    }
}
