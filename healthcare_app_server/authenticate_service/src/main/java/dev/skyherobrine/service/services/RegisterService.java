package dev.skyherobrine.service.services;

import dev.skyherobrine.service.dtos.UserRegisterDTO;
import dev.skyherobrine.service.models.User;
import dev.skyherobrine.service.repositories.UserRepository;
import dev.skyherobrine.service.utils.EncodeDecodeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

@Service
@Slf4j
public class RegisterService {

    private UserRepository ur;

    public RegisterService(UserRepository ur) {
        this.ur = ur;
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
