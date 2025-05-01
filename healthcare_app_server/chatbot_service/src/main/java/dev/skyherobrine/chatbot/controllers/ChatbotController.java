package dev.skyherobrine.chatbot.controllers;

import dev.skyherobrine.chatbot.models.Response;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.mistralai.MistralAiChatModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chatbot/api/v1/chat")
public class ChatbotController {

    private static final Logger log = LoggerFactory.getLogger(ChatbotController.class);
    private final MistralAiChatModel model;

    public ChatbotController(MistralAiChatModel model) {
        this.model = model;
    }

    @GetMapping("/send")
    public ResponseEntity<Response> generateChat(@RequestBody String message) {
        try {
            log.info("Chatbot: Call the api for generating message chat");
            String response = model.call(message);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Generating the message of chatbot",
                    response
            ));
        } catch (Exception e) {
            log.error("Chatbot: the api throw an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }
}
