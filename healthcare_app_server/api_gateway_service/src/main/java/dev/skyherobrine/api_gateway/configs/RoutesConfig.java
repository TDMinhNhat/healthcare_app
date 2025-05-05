package dev.skyherobrine.api_gateway.configs;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.URI;

@Configuration
@OpenAPIDefinition(info = @Info(title = "API Gateway Service", version = "1.0.0", description = "Documentation API Gateway Service v1.0.0"))
public class RoutesConfig {

    @Bean
    public RouteLocator configRouteLocator(RouteLocatorBuilder builder) throws Exception {
        return builder.routes()
                .route("authenticate_service", r -> r.path("/authenticate/**").uri("http://authenticate:9000"))
                .route("admin_service", r -> r.path("/admin/**").uri("http://admin:10000"))
                .route("appointment_service", r -> r.path("/appointment/**").uri("http://appointment:11000"))
                .route("image_detect_service", r -> r.path("/image_detect/**").uri("http://imagedetect:8000"))
                .route("gps_service", r -> r.path("/gps/**").uri("ws://gps:3000"))
                .route("chat_service", r -> r.path("/chat/**").uri("ws://chat:4000"))
                .route("chatbot_service", r -> r.path("/chatbot/**").uri("http://chatbot:14000"))
                .build();
    }
}
