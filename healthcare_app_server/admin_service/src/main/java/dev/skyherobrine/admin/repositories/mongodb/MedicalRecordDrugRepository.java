package dev.skyherobrine.admin.repositories.mongodb;

import dev.skyherobrine.admin.keys.MedicalRecordDrugKey;
import dev.skyherobrine.admin.models.mongodb.MedicalRecordDrug;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalRecordDrugRepository extends MongoRepository<MedicalRecordDrug, MedicalRecordDrugKey> {
}
