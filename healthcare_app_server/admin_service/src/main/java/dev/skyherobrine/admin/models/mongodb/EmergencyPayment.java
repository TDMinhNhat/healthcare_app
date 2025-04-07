package dev.skyherobrine.admin.models.mongodb;

import dev.skyherobrine.admin.models.mariadb.Patient;
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
    private Patient patient;

    public EmergencyPayment(Long id, Double price, String content, Patient patient) {
        super(id, price, content);
        this.patient = patient;
        this.emergencyTime = LocalDateTime.now();
    }
}
