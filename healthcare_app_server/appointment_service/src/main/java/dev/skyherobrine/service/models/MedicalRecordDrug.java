package dev.skyherobrine.service.models;

import dev.skyherobrine.service.keys.MedicalRecordDrugKey;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity @Table(name = "medical_record_drugs")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class MedicalRecordDrug {

    @EmbeddedId @NonNull
    private MedicalRecordDrugKey id;

    @Column(nullable = false) @NonNull
    private Double quantity;

    @Column(name = "how_use", length = 5000, nullable = false) @NonNull
    private String howUse;
}
