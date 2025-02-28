package dev.skyherobrine.service.services;

import dev.skyherobrine.service.utils.SendMailUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class EmailVerifyService {

    private final SendMailUtil sendMail;
    private final RedisOperations<String,Object> redisOperations;

    public EmailVerifyService(SendMailUtil sendMail, RedisOperations<String, Object> redisOperations) {
        this.sendMail = sendMail;
        this.redisOperations = redisOperations;
    }

    public boolean sendOtp(String email) {
        try {
            // Generate a number
            String otp = String.valueOf(ThreadLocalRandom.current().nextInt(111111,999999));
            log.info("Email Verify Service: The otp is {}", otp);

            // Save the otp to redis with duration is 5 minutes
            redisOperations.opsForValue().set(email, otp, 5, TimeUnit.MINUTES);
            log.info("Email Verify Service: The otp is saved to redis");

            // Send email
            sendMail.sendSimpleMessage(email, "Active Email", "Your OTP to active your email is: " + otp);
            log.info("Email Verify Service: The email is sent");

            return true;
        } catch (Exception e) {
            log.error("Email Verify Service: Send OTP failed!");
            log.error(e.getMessage());
            return false;
        }
    }
}
