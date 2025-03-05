package dev.skyherobrine.service.keys;

import dev.skyherobrine.service.models.mariadb.Drug;
import dev.skyherobrine.service.models.mongodb.MedicalRecord;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.io.Serializable;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MedicalRecordDrugKey implements Serializable {
    private MedicalRecord medicalRecord;
    private Drug drug;
}
