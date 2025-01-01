package dev.skyherobrine.service.messages.consumers;

import dev.skyherobrine.service.models.AuthenticateProvider;
import dev.skyherobrine.service.repositories.AuthenticateProviderRepository;
import dev.skyherobrine.service.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AuthenticateProviderConsumer {

    private final AuthenticateProviderRepository apr;

    public AuthenticateProviderConsumer(AuthenticateProviderRepository apr) {
        this.apr = apr;
    }

    @KafkaListener(topics = "insert_authenticate_provider", id = "authenticate_insert_authenticate_provider")
    public void insertAuthenticateProvider(String message) throws Exception {
        log.info("Listen insert authenticate provider message: {}", message);
        AuthenticateProvider ap = ObjectParser.convertJsonToObject(message, AuthenticateProvider.class);
        apr.save(ap);
    }
}
