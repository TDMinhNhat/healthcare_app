package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.repositories.PatientRepository;
import dev.skyherobrine.service.services.EmailVerifyService;
import dev.skyherobrine.service.utils.ObjectParser;
import dev.skyherobrine.service.utils.SendMailUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/authenticate/api/v1/email_verify")
@Slf4j
public class EmailVerifyController {

    private final RedisOperations<String,Object> redisOperations;
    private final EmailVerifyService evs;
    private final PatientRepository pr;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public EmailVerifyController(RedisOperations<String, Object> redisOperations, EmailVerifyService evs, PatientRepository pr, KafkaTemplate<String, String> kafkaTemplate) {
        this.redisOperations = redisOperations;
        this.evs = evs;
        this.pr = pr;
        this.kafkaTemplate = kafkaTemplate;
    }

    @GetMapping("/send")
    public ResponseEntity<Response> sendOtp(@RequestParam String email) {
        try {
            log.info("Email Verify: Call the api send otp");
            boolean result = evs.sendOtp(email);
            if(result) {
                log.info("Email Verify: The otp is sent to your email");
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "The otp is sent to your email",
                        true
                ));
            }
            log.warn("Email Verify: The otp is not sent to your email");
            return ResponseEntity.ok(new Response(
                    HttpStatus.NOT_FOUND.value(),
                    "The otp is not sent to your email",
                    false
            ));
        } catch (Exception e) {
            log.error("Email Verify: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api send otp return an error",
                    e.getMessage()
            ));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Response> verifyOtp(
            @RequestParam String email,
            @RequestParam String otp
    ) {
        try {
            log.info("Email Verify: Call the api verify otp");
            String getValue = String.valueOf(redisOperations.opsForValue().get(email));

            if(getValue.equals(otp)) {
                log.info("Email Verify: The otp to verify is correct");
                int result = pr.updateVerifyEmail(email);
                if(result == 1) {
                    log.info("Email Verify: The email is verified");
                    log.info("Email Verify: Sending the message to kafka");
                    kafkaTemplate.send("update_verify_email", ObjectParser.convertObjectToJson(email));
                    return ResponseEntity.ok(new Response(
                            HttpStatus.OK.value(),
                            "The email is verified",
                            true
                    ));
                } else {
                    log.warn("Email Verify: The email is not verified in database for can't found email");
                    return ResponseEntity.ok(new Response(
                            HttpStatus.NOT_FOUND.value(),
                            "The email is not verified in database for can't found email",
                            false
                    ));
                }
            }

            log.warn("Email Verify: The otp to verify is incorrect or expired");
            return ResponseEntity.ok(new Response(
                    HttpStatus.BAD_REQUEST.value(),
                    "The otp to verify is incorrect or expired",
                    false
            ));
        } catch (Exception e) {
            log.error("Email Verify: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api verify otp return an error",
                    e.getMessage()
            ));
        }
    }
}
