package dev.skyherobrine.admin.models.mongodb;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "emergency_payments")
@Getter @Setter
@NoArgsConstructor
public class EmergencyPayment extends Payment{

    private LocalDateTime emergencyTime;

    public EmergencyPayment(Long id, String userId, Double price, String content) {
        super(id, userId, price, content);
        this.emergencyTime = LocalDateTime.now();
    }
}
