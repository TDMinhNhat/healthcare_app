package dev.skyherobrine.admin.repositories.mongodb;

import dev.skyherobrine.admin.enums.PaymentStatus;
import dev.skyherobrine.admin.models.mongodb.BookAppointment;
import dev.skyherobrine.admin.models.mongodb.BookAppointmentPayment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookAppointmentPaymentRepository extends MongoRepository<BookAppointmentPayment,Long> {
    List<BookAppointmentPayment> findByStatus(PaymentStatus status);

    Optional<BookAppointmentPayment> findByBookAppointment_Id(Long bookAppointmentId);

    List<BookAppointmentPayment> findByBookAppointment_WorkSchedule_DateAppointment_Year(int year);
}
