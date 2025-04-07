package dev.skyherobrine.appointment.repositories.mongodb;

import dev.skyherobrine.appointment.models.mongodb.BookAppointmentPayment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookAppointmentPaymentRepository extends MongoRepository<BookAppointmentPayment,Long> {
}
