package dev.skyherobrine.admin.keys;

import dev.skyherobrine.admin.models.mariadb.Drug;
import dev.skyherobrine.admin.models.mongodb.MedicalRecord;
import lombok.*;

import java.io.Serializable;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MedicalRecordDrugKey implements Serializable {
    private MedicalRecord medicalRecord;
    private Drug drug;
}
