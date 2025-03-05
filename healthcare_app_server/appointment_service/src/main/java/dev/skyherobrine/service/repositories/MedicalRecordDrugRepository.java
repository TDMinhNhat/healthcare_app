package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.keys.MedicalRecordDrugKey;
import dev.skyherobrine.service.models.mariadb.MedicalRecordDrug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalRecordDrugRepository extends JpaRepository<MedicalRecordDrug, MedicalRecordDrugKey> {
}
