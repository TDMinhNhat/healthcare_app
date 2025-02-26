package dev.skyherobrine.service.keys;

import dev.skyherobrine.service.models.Drug;
import dev.skyherobrine.service.models.MedicalRecord;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MedicalRecordDrugKey implements Serializable {

    @ManyToOne @JoinColumn(name = "medical_record", nullable = false) @NonNull
    private MedicalRecord medicalRecord;

    @ManyToOne @JoinColumn(nullable = false) @NonNull
    private Drug drug;
}
