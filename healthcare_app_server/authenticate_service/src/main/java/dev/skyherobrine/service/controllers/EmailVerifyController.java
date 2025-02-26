package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.services.EmailVerifyService;
import dev.skyherobrine.service.utils.SendMailUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/authenticate/api/v1/email_verify")
@Slf4j
public class EmailVerifyController {

    private final EmailVerifyService evs;

    public EmailVerifyController(EmailVerifyService evs) {
        this.evs = evs;
    }

    @GetMapping("/send_otp")
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
}
