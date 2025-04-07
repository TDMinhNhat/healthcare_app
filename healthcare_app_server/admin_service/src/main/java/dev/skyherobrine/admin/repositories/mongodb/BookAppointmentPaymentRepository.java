package dev.skyherobrine.admin.repositories.mongodb;

import dev.skyherobrine.admin.models.mongodb.BookAppointmentPayment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookAppointmentPaymentRepository extends MongoRepository<BookAppointmentPayment,Long> {
}
