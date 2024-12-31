package dev.skyherobrine.service.controllers;

import dev.skyherobrine.service.models.Response;
import dev.skyherobrine.service.services.ForgotPasswordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("authenticate/api/v1/forgot_password")
public class ForgotPasswordController {

    private final ForgotPasswordService fps;

    public ForgotPasswordController(ForgotPasswordService fps) {
        this.fps = fps;
    }

    public ResponseEntity<Response> solveForgot(@RequestParam("email") String email) {

        return null;
    }
}
