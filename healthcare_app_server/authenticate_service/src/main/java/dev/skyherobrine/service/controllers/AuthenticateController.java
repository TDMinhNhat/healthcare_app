package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.dtos.PatientRegisterDTO;
import dev.skyherobrine.service.models.mariadb.Response;
import dev.skyherobrine.service.models.mariadb.User;
import dev.skyherobrine.service.services.AuthenticateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api check login return an error",
                    e.getMessage()
            ));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Response> registerAccount(@RequestBody PatientRegisterDTO patientRegisterDTO) {
        try {
            log.info("Authenticate: Call the api create a new account");
            User result = as.registerAccount(patientRegisterDTO);

            if(result != null) {
                log.info("Authenticate: Create a new account successfully");
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Create a new account successfully",
                        result
                ));
            }
            log.warn("Authenticate: Create a new account failed");
            return ResponseEntity.ok(new Response(
                    HttpStatus.BAD_REQUEST.value(),
                    "Create a new account failed",
                    null
            ));
        } catch (Exception e) {
            log.error("Authenticate: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api create a new account return an error",
                    e.getMessage()
            ));
        }
    }

    @PostMapping("/reset_password")
    public ResponseEntity<Response> resetPassword(
            @RequestParam String email
    ) {
        try {
            log.info("Authenticate: Call the api reset the password");
            boolean result = as.resetPassword(email);
            if(result) {
                log.info("Authenticate: Reset the password successfully. Send a message to the email");
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Reset the password successfully. Send a message to the email",
                        true
                ));
            }
            log.warn("Authenticate: Reset the password failed");
            return ResponseEntity.ok(new Response(
                    HttpStatus.BAD_REQUEST.value(),
                    "Reset the password failed",
                    false
            ));
        } catch (Exception e) {
            log.error("Authenticate: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api reset the password return an error",
                    e.getMessage()
            ));
        }
    }
}
