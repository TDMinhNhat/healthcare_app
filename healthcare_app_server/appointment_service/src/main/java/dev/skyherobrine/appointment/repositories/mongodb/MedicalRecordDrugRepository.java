package dev.skyherobrine.appointment.repositories.mongodb;

import dev.skyherobrine.appointment.keys.MedicalRecordDrugKey;
import dev.skyherobrine.appointment.models.mongodb.MedicalRecordDrug;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordDrugRepository extends MongoRepository<MedicalRecordDrug, MedicalRecordDrugKey> {
    List<MedicalRecordDrug> findById_MedicalRecord_Id(Long id);

}
