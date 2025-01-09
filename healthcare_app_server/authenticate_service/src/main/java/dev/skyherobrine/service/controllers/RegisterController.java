package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.dtos.UserRegisterDTO;
import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.models.User;
import dev.skyherobrine.service.repositories.UserRepository;
import dev.skyherobrine.service.services.RegisterService;
import dev.skyherobrine.service.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("authenticate/api/v1/register")
@Slf4j
public class RegisterController {

    private final RegisterService rs;
    private final UserRepository ur;
    private final KafkaTemplate<String, String> template;
    private final RedisTemplate<String, Object> redisTemplate;

    public RegisterController(RegisterService rs, UserRepository ur, KafkaTemplate<String, String> template, RedisTemplate<String, Object> redisTemplate) {
        this.rs = rs;
        this.ur = ur;
        this.template = template;
        this.redisTemplate = redisTemplate;
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

    @GetMapping("/otp")
    public ResponseEntity<Response> sendOTPActiveUser(@RequestParam("email") String email) {
        try {
            log.info("Call the send otp active user method");
            User user = ur.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found"));

            int valueRandom = new Random().nextInt(111111111, 999999999);
            redisTemplate.opsForValue().set(user.getId() + "_otp", valueRandom, 120, TimeUnit.SECONDS);

            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Send OTP message successfully",
                    user
            ));
        } catch (EntityNotFoundException e) {
            log.warn("The user is not found");
            return ResponseEntity.ok(new Response(
                    HttpStatus.NOT_FOUND.value(),
                    "The user is not found",
                    e
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

    @GetMapping("/active/{user_id}")
    public ResponseEntity<Response> activeUser(@PathVariable("user_id") String userId, @RequestParam("otpMessage") String otpMessage) {
        try {
            log.info("Call active user method");

            User user = ur.findById(Long.parseLong(userId)).orElseThrow(() -> new EntityNotFoundException("The entity was not found"));

            String result = (String) redisTemplate.opsForValue().get(user.getUserId() + "_otp");
            if(result == null) {
                log.warn("The OTP message from the user {}", (user.getUserId() + " - " + user.getUsername()) + " was expired");
                return ResponseEntity.ok(new Response(
                        HttpStatus.NOT_FOUND.value(),
                        "The OTP message is expired",
                        null
                ));
            } else if(result.equals(otpMessage)) {
                log.info("The user {} was activated successfully", (user.getUserId() + " - " + user.getUsername()));
                user.setEmailVerified(true);
                ur.save(user);

                template.send("verify_user", ObjectParser.convertObjectToJson(user));

                redisTemplate.delete(user.getUserId() + "_otp");
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "The user is activated successfully",
                        user
                ));
            } else {
                log.warn("The OTP message is not correct");
                return ResponseEntity.ok(new Response(
                        HttpStatus.BAD_REQUEST.value(),
                        "The OTP message is not correct",
                        null
                ));
            }
        } catch (EntityNotFoundException e) {
            log.warn("The user is not found!");
            return ResponseEntity.ok(new Response(
                    HttpStatus.NOT_FOUND.value(),
                    "The user is not found",
                    e
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
