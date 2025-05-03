package dev.skyherobrine.api_gateway.configs;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "API Gateway Service", version = "1.0.0", description = "Documentation API Gateway Service v1.0.0"))
public class RoutesConfig {

    @Bean
    public RouteLocator configRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("authenticate_service", r -> r.path("/authenticate/**").uri("http://authenticate_service:9000"))
                .route("admin_service", r -> r.path("/admin/**").uri("http://admin_service:10000"))
                .route("appointment_service", r -> r.path("/appointment/**").uri("http://appointment_service:11000"))
                .route("image_detect_service", r -> r.path("/image_detect/**").uri("http://image_detect_service:8000"))
                .route("gps_service", r -> r.path("/gps/**").uri("ws://gps_service:3000"))
                .route("chat_service", r -> r.path("/chat/**").uri("ws://chat_service:4000"))
                .route("chatbot_service", r -> r.path("/chatbot/**").uri("http://chatbot_service:14000"))
                .build();
    }
}
