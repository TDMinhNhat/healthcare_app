package dev.skyherobrine.admin.models.mongodb;

import dev.skyherobrine.admin.models.mariadb.Patient;
import dev.skyherobrine.admin.models.mariadb.Price;
import dev.skyherobrine.admin.models.mongodb.Emergency;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "emergency_payments")
@Getter @Setter
@NoArgsConstructor
public class EmergencyPayment extends Payment{

    private Emergency emergency;
    @Field(name = "patient_id")
    private Patient patientId;

    public EmergencyPayment(Long id, Price price, String content, Patient patientId, Emergency emergency) {
        super(id, price, content);
        this.patientId = patientId;
        this.emergency = emergency;
    }
}
