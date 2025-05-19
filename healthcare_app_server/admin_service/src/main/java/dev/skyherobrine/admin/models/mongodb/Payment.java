package dev.skyherobrine.admin.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.admin.enums.PaymentStatus;
import dev.skyherobrine.admin.models.mariadb.Price;
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
    private Price price;
    private String content;
    @Field(name = "created_at")
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    private LocalDateTime createdAt;
    private PaymentStatus status;

    public Payment(Long id, Price price, String content) {
        this.id = id;
        this.price = price;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.status = PaymentStatus.WAITING_PAY;
    }

    public Payment(Long id, Price price, String content, PaymentStatus status) {
        this.id = id;
        this.price = price;
        this.content = content;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }
}
