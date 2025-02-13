package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.core5.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("authenticate/api/v1/user")
@Slf4j
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/user_id/{user_id}")
    public ResponseEntity<Response> getUserByUserId(@PathVariable("user_id") String userId) {
        try {
            log.info("Call get user by user id");
            return ResponseEntity.ok(new Response(
                    HttpStatus.SC_OK,
                    "User found",
                    userRepository.findByUserId("#" + userId)
            ));
        } catch (Exception e) {
            log.error("Server return an error: {}", e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.SC_SERVER_ERROR,
                    "The server return an error, please try again",
                    e
            ));
        }
    }
}
