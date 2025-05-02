package dev.skyherobrine.authenticate.configs;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@OpenAPIDefinition
public class OpenAPIConfig {

    @Bean
    public OpenAPI userOpenAPI() {
        return new OpenAPI().servers(List.of(new Server().url("http://localhost:9000"))).info(new Info().title("Authenticate API Service").version("1.0.0"));
    }
}
