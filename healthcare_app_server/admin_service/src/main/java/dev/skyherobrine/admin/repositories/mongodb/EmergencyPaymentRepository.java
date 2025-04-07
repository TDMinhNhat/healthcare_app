package dev.skyherobrine.admin.repositories.mongodb;

import dev.skyherobrine.admin.models.mongodb.EmergencyPayment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmergencyPaymentRepository extends MongoRepository<EmergencyPayment,Long> {
}
