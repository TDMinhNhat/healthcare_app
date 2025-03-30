package dev.skyherobrine.appointment.repositories.mongodb;

import dev.skyherobrine.appointment.models.mongodb.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment,Long> {
    Optional<Payment> findByBookAppointment_Id(Long id);

    Optional<Payment> findTopByOrderByIdDesc();

    List<Payment> findByBookAppointment_PatientId(String patientId);
}
