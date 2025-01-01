package dev.skyherobrine.service.services;

import dev.skyherobrine.service.dtos.UserRegisterDTO;
import dev.skyherobrine.service.models.AuthenticateProvider;
import dev.skyherobrine.service.models.User;
import dev.skyherobrine.service.repositories.AuthenticateProviderRepository;
import dev.skyherobrine.service.repositories.UserRepository;
import dev.skyherobrine.service.repositories.UserRoleRepository;
import dev.skyherobrine.service.utils.EncodeDecodeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class RegisterService {

    private UserRepository ur;
    private AuthenticateProviderRepository apr;
    private UserRoleRepository urr;

    public RegisterService(UserRepository ur, AuthenticateProviderRepository apr, UserRoleRepository urr) {
        this.ur = ur;
        this.apr = apr;
        this.urr = urr;
    }

    public User registerAccount(UserRegisterDTO userRegisterDTO) throws Exception {
        String getUserId = generateUserId(userRegisterDTO);
        User user = new User(
                getUserId,
                userRegisterDTO.getFullName(),
                userRegisterDTO.getSex(),
                userRegisterDTO.getDobLocalDate(),
                userRegisterDTO.getPhone(),
                EncodeDecodeUtil.encode(userRegisterDTO.getEmail()),
                EncodeDecodeUtil.encode(userRegisterDTO.getPassword())
        );
        user.setAuthedProvider(apr.findAuthenticateProviderByAuthenName("APPLICATION").get());
        user.setRole(urr.findUserRoleByRoleName("USER").get());

        if(ur.findByUserId(user.getUserId()).isPresent()) return null;

        User target = ur.save(user);
        return target;
    }

    private String generateUserId(UserRegisterDTO userRegisterDTO) {
        LocalDateTime now = LocalDateTime.now();
        String result = "#" + DateTimeFormatter.ofPattern("yyyyMMddHHmmss").format(now);
        result += userRegisterDTO.getSex() ? "M" : "F";
        result += ThreadLocalRandom.current().nextInt(100, 999);
        return result;
    }
}
