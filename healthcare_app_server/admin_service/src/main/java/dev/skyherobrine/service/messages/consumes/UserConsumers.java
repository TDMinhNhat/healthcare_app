package dev.skyherobrine.service.messages.consumes;

import dev.skyherobrine.service.models.mariadb.User;
import dev.skyherobrine.service.repositories.mariadb.UserRepository;
import dev.skyherobrine.service.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class UserConsumers {

    private final UserRepository ur;

    public UserConsumers(UserRepository ur) {
        this.ur = ur;
    }

    @KafkaListener(topics = "insert_user", id = "admin_insert_user")
    public void insertUser(String message) throws Exception {
        log.info("Listen insert user message: {}", message);
        User user = ObjectParser.convertJsonToObject(message, User.class);
        User newUser = new User(
                user.getUserId(),
                user.getFirstName(),
                user.getLastName(),
                user.getSex(),
                user.getDob(),
                user.getPhone(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword()
        );

        if(user.getAddress() != null) {
            newUser.setAddress(user.getAddress());
        }

        newUser.setAuthedProvider(user.getAuthedProvider());
        newUser.setRole(user.getRole());
        ur.save(newUser);
    }

    @KafkaListener(topics = "verify_user", id = "admin_verify_user")
    public void verifyUser(String message) throws Exception {
        log.info("Listen verify user message: {}", message);
        String userId = ObjectParser.convertJsonToObject(message, String.class);
        User user = ur.findById(Long.parseLong(userId)).orElseThrow(() -> new Exception("User not found"));
        user.setEmailVerified(true);
        ur.save(user);
    }
}
