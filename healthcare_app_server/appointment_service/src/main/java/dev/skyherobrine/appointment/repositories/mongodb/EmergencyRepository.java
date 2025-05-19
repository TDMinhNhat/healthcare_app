package dev.skyherobrine.appointment.repositories.mongodb;

import dev.skyherobrine.appointment.models.mongodb.Emergency;
import dev.skyherobrine.appointment.models.mongodb.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmergencyRepository extends MongoRepository<Emergency,Long> {
    Optional<Emergency> findTopByOrderByIdDesc();
}
