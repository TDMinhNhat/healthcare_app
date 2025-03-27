package dev.skyherobrine.appointment.repositories.mongodb;

import dev.skyherobrine.appointment.models.mongodb.MedicalRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalRecordRepository extends MongoRepository<MedicalRecord,Long> {
    Optional<MedicalRecord> findTopByOrderByIdDesc();

    List<MedicalRecord> findByBookAppointment_PatientIdAndBookAppointment_IdNot(String patientId, Long id);

    Optional<MedicalRecord> findByBookAppointment_Id(Long appointmentId);

    List<MedicalRecord> findByBookAppointment_PatientId(String userId);
}
