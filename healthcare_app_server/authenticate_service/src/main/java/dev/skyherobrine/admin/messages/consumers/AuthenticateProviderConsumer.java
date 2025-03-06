package dev.skyherobrine.admin.messages.consumers;

import dev.skyherobrine.admin.models.mariadb.AuthenticateProvider;
import dev.skyherobrine.admin.repositories.mariadb.AuthenticateProviderRepository;
import dev.skyherobrine.admin.utils.ObjectParser;
import jakarta.transaction.Transactional;
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
    @Transactional
    public void insertAuthenticateProvider(String message) throws Exception {
        log.info("Listen insert authenticate provider message: {}", message);
        AuthenticateProvider ap = ObjectParser.convertJsonToObject(message, AuthenticateProvider.class);
        AuthenticateProvider apNew = new AuthenticateProvider(ap.getAuthenName());
        apr.save(apNew);
    }
}
