package dev.skyherobrine.admin.models.mongodb;

import dev.skyherobrine.admin.enums.PaymentStatus;
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
    @Field(name = "user_id")
    private String userId;
    private Double price;
    private String content;
    private LocalDateTime createdAt;
    private PaymentStatus status;

    public Payment(Long id, String userId, Double price, String content) {
        this.id = id;
        this.userId = userId;
        this.price = price;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.status = PaymentStatus.WAITING_PAY;
    }
}
