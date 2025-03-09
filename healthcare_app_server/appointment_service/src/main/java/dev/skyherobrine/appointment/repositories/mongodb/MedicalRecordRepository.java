package dev.skyherobrine.appointment.repositories.mongodb;

import dev.skyherobrine.appointment.models.mongodb.MedicalRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicalRecordRepository extends MongoRepository<MedicalRecord,Long> {
    Optional<MedicalRecord> findTopByOrderByIdDesc();
}
