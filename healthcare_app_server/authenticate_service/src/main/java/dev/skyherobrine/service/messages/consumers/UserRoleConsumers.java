package dev.skyherobrine.service.messages.consumers;

import dev.skyherobrine.service.models.UserRole;
import dev.skyherobrine.service.repositories.UserRoleRepository;
import dev.skyherobrine.service.utils.ObjectParser;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class UserRoleConsumers {

    private final UserRoleRepository urr;

    public UserRoleConsumers(UserRoleRepository urr) {
        this.urr = urr;
    }

    @KafkaListener(topics = "insert_user_role", groupId = "insert_user_role_authed_admin")
    public void insertUserRole(String message) throws Exception {
        UserRole target = ObjectParser.convertJsonToObject(message, UserRole.class);
        urr.save(target);
    }
}
