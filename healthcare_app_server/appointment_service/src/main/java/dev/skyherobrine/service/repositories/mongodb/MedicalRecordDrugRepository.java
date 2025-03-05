package dev.skyherobrine.service.repositories.mongodb;

import dev.skyherobrine.service.keys.MedicalRecordDrugKey;
import dev.skyherobrine.service.models.mongodb.MedicalRecordDrug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalRecordDrugRepository extends MongoRepository<MedicalRecordDrug, MedicalRecordDrugKey> {
}
