package dev.skyherobrine.appointment.repositories.mongodb;

import dev.skyherobrine.appointment.models.mongodb.MedicalRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalRecordRepository extends MongoRepository<MedicalRecord,Long> {
}
