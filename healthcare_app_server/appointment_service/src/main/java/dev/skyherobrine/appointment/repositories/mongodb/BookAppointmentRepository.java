package dev.skyherobrine.appointment.repositories.mongodb;

import dev.skyherobrine.appointment.enums.AppointmentStatus;
import dev.skyherobrine.appointment.models.mongodb.BookAppointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookAppointmentRepository extends MongoRepository<BookAppointment,Long> {

    Optional<BookAppointment> findTopByOrderByIdDesc();

    Optional<BookAppointment> findFirstByAppointmentIdOrderByNumericalOrderDesc(String appointmentId);

    long countByAppointment_Id(Long id);

    long countByAppointment_IdAndStatusNot(Long id, AppointmentStatus status);

    List<BookAppointment> findByStatus(AppointmentStatus status);

    List<BookAppointment> findByAppointment_Id(Long id);


}
