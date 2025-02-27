package dev.skyherobrine.service.configs;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@OpenAPIDefinition
@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI userOpenAPI() {
        return new OpenAPI().servers(List.of(new Server().url("http://localhost:10000"))).info(new Info().title("Admin Service API").version("1.0.0"));
    }
}
