package dev.skyherobrine.appointment.sockets;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
@Slf4j
public class BookingSocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final RestTemplate restTemplate;
    @Value("${bearer-sepay}")
    private String getBearerSepayToken;

    public BookingSocketController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.restTemplate = new RestTemplate();
    }

    @MessageMapping("/check_payment")
    public synchronized void checkPaymentBookAppointment(String data) {
        try {
            log.info("Booking Socket: listen the request check payment");
            log.info("Booking Socket: data: " + data);
            JsonNode getDataNode = new ObjectMapper().readTree(data);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + getBearerSepayToken);

            JsonNode node = new ObjectMapper().readTree(restTemplate.exchange(
                    "https://my.sepay.vn/userapi/transactions/list?transaction_date_min=" + LocalDateTime.now().minusDays(1L).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                     + "&transaction_date_max=" + LocalDateTime.now().plusDays(1L).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                            + "&amount_in=" + getDataNode.get("amount_in"), HttpMethod.GET, new HttpEntity<>(headers), String.class).getBody())
                    .get("transactions");
            System.out.println(node);
            for (JsonNode transaction : node) {
                if (transaction.get("transaction_content").asText().equals(getDataNode.get("transaction_content").asText())) {
                    log.info("Booking Socket: payment found");
                    simpMessagingTemplate.convertAndSend("/patient/result_check_payment", true);
                    return;
                }
            }
            log.info("Booking Socket: payment not found");
        } catch (Exception e) {
            log.error("Booking Socket: socket thrown an error");
            log.error("Booking Socket: ", e);
        }
    }
}
