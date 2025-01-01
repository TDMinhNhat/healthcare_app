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
                .route("admin_service", r -> r.path("/admin/**").uri("http://localhost:8000"))
                .build();
    }
}
