package dev.skyherobrine.service.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/swagger")
public class SwaggerController {

    private final WebClient webClient;

    public SwaggerController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @GetMapping("/admin-service")
    public Mono<String> adminServiceDocs() {
        return webClient.get().uri("http://localhost:10000/v1/api-docs").retrieve().bodyToMono(String.class);
    }

    @GetMapping("/authenticate-service")
    public Mono<String> authenticateServiceDocs() {
        return webClient.get().uri("http://localhost:9000/v1/api-docs").retrieve().bodyToMono(String.class);
    }

    @GetMapping("/appointment-service")
    public Mono<String> appointmentServiceDocs() {
        return webClient.get().uri("http://localhost:11000/v1/api-docs").retrieve().bodyToMono(String.class);
    }
}
