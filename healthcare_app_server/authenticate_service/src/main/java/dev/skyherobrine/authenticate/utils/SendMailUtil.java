package dev.skyherobrine.authenticate.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class SendMailUtil {

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(String receiver, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("skyherobrine13092003@gmail.com");
        message.setTo(receiver);
        message.setSubject(subject);
        message.setText(content);
        emailSender.send(message);
    }
}
