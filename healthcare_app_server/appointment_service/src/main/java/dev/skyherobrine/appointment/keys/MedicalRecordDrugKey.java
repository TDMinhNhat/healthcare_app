package dev.skyherobrine.appointment.keys;

import dev.skyherobrine.appointment.models.mariadb.Drug;
import dev.skyherobrine.appointment.models.mongodb.MedicalRecord;
import lombok.*;

import java.io.Serializable;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MedicalRecordDrugKey implements Serializable {
    private MedicalRecord medicalRecord;
    private Drug drug;
}
