package dev.skyherobrine.service.services;

import dev.skyherobrine.service.models.User;
import dev.skyherobrine.service.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ForgotPasswordService {

    private final UserRepository ur;

    public ForgotPasswordService(UserRepository ur) {
        this.ur = ur;
    }

    public boolean solveForgotPass(String email) {
        User target = ur.findByEmail(email).orElse(null);
        if(target == null) return false;

        return false;
    }
}
