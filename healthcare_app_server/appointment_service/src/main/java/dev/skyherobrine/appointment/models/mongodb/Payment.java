package dev.skyherobrine.appointment.models.mongodb;

import dev.skyherobrine.appointment.enums.PaymentStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
public abstract class Payment {

    @MongoId
    private Long id;
    private Double price;
    private String content;
    private LocalDateTime createdAt;
    private PaymentStatus status;

    public Payment(Long id, Double price, String content) {
        this.id = id;
        this.price = price;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.status = PaymentStatus.WAITING_PAY;
    }

    public Payment(Long id, Double price, String content, PaymentStatus status) {
        this.id = id;
        this.price = price;
        this.content = content;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }
}
