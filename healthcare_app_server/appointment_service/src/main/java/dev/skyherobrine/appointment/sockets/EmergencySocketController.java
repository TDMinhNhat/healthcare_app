package dev.skyherobrine.appointment.sockets;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.skyherobrine.appointment.dtos.EmergencyDTO;
import dev.skyherobrine.appointment.models.mongodb.Emergency;
import dev.skyherobrine.appointment.services.EmergencyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class EmergencySocketController {

    private final EmergencyService emergencyService;

    public EmergencySocketController(EmergencyService emergencyService) {
        this.emergencyService = emergencyService;
    }

    @MessageMapping("/add_emergency")
    public void addEmergency(String data) {
        try {
            log.info("Emergency Socket: listen message for requesting add emergency");
            JsonNode node = new ObjectMapper().readTree(data);

            EmergencyDTO emergencyDTO = new EmergencyDTO(
                    node.get("patientId").asText(),
                    node.get("doctorId").asText()
            );
            emergencyService.addEmergency(emergencyDTO);

        } catch (Exception e) {
            log.error("Emergency Socket: the listen message thrown an error");
            log.error("Emergency Socket: {}", e.getMessage());
        }
    }
}
