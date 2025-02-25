package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.models.User;
import dev.skyherobrine.service.services.AuthenticateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("authenticate/api/v1/authenticate")
@Slf4j
public class AuthenticateController {

    private final AuthenticateService as;

    public AuthenticateController(AuthenticateService as) {
        this.as = as;
    }

    @PostMapping("/login")
    public ResponseEntity<Response> checkLogin(
            @RequestParam String email,
            @RequestParam String password
    ) {
        try {
            log.info("Authenticate: Call the api check login");
            User user = as.checkLogin(email, password);

            if(user != null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Login account successfully",
                        user
                ));
            }

            log.warn("Authenticate: Can't found the user with those email and password");
            return ResponseEntity.ok(new Response(
                    HttpStatus.NOT_FOUND.value(),
                    "Can't found the user with those email and password",
                    null
            ));
        } catch (Exception e) {
            log.error("Authenticate: The api return an error");
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api check login return an error",
                    e
            ));
        }
    }
}
