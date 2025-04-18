package dev.skyherobrine.admin.repositories.mongodb;

import dev.skyherobrine.admin.enums.PaymentStatus;
import dev.skyherobrine.admin.models.mongodb.BookAppointmentPayment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookAppointmentPaymentRepository extends MongoRepository<BookAppointmentPayment,Long> {
    List<BookAppointmentPayment> findByStatus(PaymentStatus status);
}
