package dev.skyherobrine.appointment.models.mongodb;

import dev.skyherobrine.appointment.models.mariadb.Price;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "emergency_payments")
@Getter @Setter
@NoArgsConstructor
public class EmergencyPayment extends Payment{

    private Emergency emergency;
    private String patientId;

    public EmergencyPayment(Long id, Price price, String content, String patientId, Emergency emergency) {
        super(id, price, content);
        this.patientId = patientId;
        this.emergency = emergency;
    }
}
