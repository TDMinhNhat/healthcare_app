package dev.skyherobrine.service.models.mongodb;

import dev.skyherobrine.service.keys.MedicalRecordDrugKey;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "medical_record_drugs")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class MedicalRecordDrug {

    @MongoId @Field(name = "id") @NonNull
    private MedicalRecordDrugKey id;

    @NonNull
    private Double quantity;

    @Field(name = "how_use") @NonNull
    private String howUse;
}
