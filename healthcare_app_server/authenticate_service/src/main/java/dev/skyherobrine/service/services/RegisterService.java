package dev.skyherobrine.service.services;

import dev.skyherobrine.service.dtos.UserRegisterDTO;
import dev.skyherobrine.service.models.Address;
import dev.skyherobrine.service.models.AuthenticateProvider;
import dev.skyherobrine.service.models.User;
import dev.skyherobrine.service.repositories.AddressRepository;
import dev.skyherobrine.service.repositories.AuthenticateProviderRepository;
import dev.skyherobrine.service.repositories.UserRepository;
import dev.skyherobrine.service.repositories.UserRoleRepository;
import dev.skyherobrine.service.utils.EncodeDecodeUtil;
import dev.skyherobrine.service.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class RegisterService {

    private final AddressRepository ar;
    private final UserRepository ur;
    private final AuthenticateProviderRepository apr;
    private final UserRoleRepository urr;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public RegisterService(UserRepository ur, AuthenticateProviderRepository apr, UserRoleRepository urr, AddressRepository ar, KafkaTemplate<String,String> kafkaTemplate) {
        this.ur = ur;
        this.apr = apr;
        this.urr = urr;
        this.ar = ar;
        this.kafkaTemplate = kafkaTemplate;
    }

    public User registerAccount(UserRegisterDTO userRegisterDTO) throws Exception {
        String getUserId = generateUserId(userRegisterDTO);
        User user = new User(
                getUserId,
                userRegisterDTO.getFirstName(),
                userRegisterDTO.getLastName(),
                userRegisterDTO.getSex(),
                userRegisterDTO.getDobLocalDate(),
                userRegisterDTO.getPhone(),
                userRegisterDTO.getUsername(),
                EncodeDecodeUtil.encode(userRegisterDTO.getEmail()),
                EncodeDecodeUtil.encode(userRegisterDTO.getPassword()),
                userRegisterDTO.getImageDetect()
        );
        if(userRegisterDTO.getAddress() != null) {
            Address address = userRegisterDTO.getAddress();
            Address result = ar.save(address);
            kafkaTemplate.send("insert_address", ObjectParser.convertObjectToJson(result));
            user.setAddress(result);
        }

        user.setAuthedProvider(apr.findAuthenticateProviderByAuthenName("APPLICATION").get());
        user.setRole(urr.findUserRoleByRoleName("USER").get());

        if(ur.findByUserId(user.getUserId()).isPresent()) return null;

        return ur.save(user);
    }

    private String generateUserId(UserRegisterDTO userRegisterDTO) {
        LocalDateTime now = LocalDateTime.now();
        String result = "#" + DateTimeFormatter.ofPattern("yyyyMMddHHmmss").format(now);
        result += userRegisterDTO.getSex() ? "M" : "F";
        result += ThreadLocalRandom.current().nextInt(100, 999);
        return result;
    }
}
