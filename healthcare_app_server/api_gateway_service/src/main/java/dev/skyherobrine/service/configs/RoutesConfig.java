package dev.skyherobrine.service.configs;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoutesConfig {

    @Bean
    public RouteLocator configRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("authenticate_service", r -> r.path("/authenticate/**").uri("http://localhost:9000"))
                .route("admin_service", r -> r.path("/admin/**").uri("http://localhost:10000"))
                .route("image_detect_service", r -> r.path("/image_detect/**").uri("http://localhost:8000"))
                .route("gps_service", r -> r.path("/gps/**").uri("ws://localhost:3000"))
                .route("chat_service", r -> r.path("/chat/**").uri("ws://localhost:4000"))
                .build();
    }
}
