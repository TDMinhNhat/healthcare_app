package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.models.User;
import dev.skyherobrine.service.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("authenticate/api/v1/login")
@Slf4j
public class LoginController {

    private final UserRepository ur;

    public LoginController(UserRepository ur) {
        this.ur = ur;
    }

    @PostMapping
    public ResponseEntity<Response> login(
            @RequestParam("email") String email,
            @RequestParam("password") String password
    ) {
        try {
            log.info("Call the login method");
            User result = ur.findByEmailAndPassword(email, password).orElse(null);
            if(result == null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.UNAUTHORIZED.value(),
                        "The email and password is not correctly",
                        null
                ));
            }
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "The user is authenticated",
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
