package dev.skyherobrine.service.repositories.mongodb;

import dev.skyherobrine.service.models.mongodb.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalRecordRepository extends MongoRepository<MedicalRecord,Long> {
}
