package dev.skyherobrine.admin.repositories.mongodb;

import dev.skyherobrine.admin.models.mongodb.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends MongoRepository<Payment,Long> {
}
