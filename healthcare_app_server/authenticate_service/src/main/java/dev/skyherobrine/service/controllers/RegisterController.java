package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.dtos.UserRegisterDTO;
import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.models.User;
import dev.skyherobrine.service.services.RegisterService;
import dev.skyherobrine.service.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("authenticate/api/v1/register")
@Slf4j
public class RegisterController {

    private final RegisterService rs;
    private final KafkaTemplate template;

    public RegisterController(RegisterService rs, KafkaTemplate template) {
        this.rs = rs;
        this.template = template;
    }

    @PostMapping
    public ResponseEntity<Response> register(@RequestBody UserRegisterDTO userRegisterDTO) {
        try {
            log.info("Call the register method");
            User result = rs.registerAccount(userRegisterDTO);

            if (result == null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.CONFLICT.value(),
                        "The user id is already registered",
                        null
                ));
            }

            template.send("insert_user", ObjectParser.convertObjectToJson(result));
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "The user is registered successfully",
                    result
            ));
        } catch (Exception e) {
            log.error("Server return an error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The server return an error, please try again later.",
                    e
            ));
        }
    }
}
