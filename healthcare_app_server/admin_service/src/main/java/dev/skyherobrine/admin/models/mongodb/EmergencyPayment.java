package dev.skyherobrine.admin.models.mongodb;

import dev.skyherobrine.admin.models.mongodb.Emergency;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "emergency_payments")
@Getter @Setter
@NoArgsConstructor
public class EmergencyPayment extends Payment{

    private Emergency emergency;
    private String patientId;

    public EmergencyPayment(Long id, Double price, String content, String patientId, Emergency emergency) {
        super(id, price, content);
        this.patientId = patientId;
        this.emergency = emergency;
    }
}
