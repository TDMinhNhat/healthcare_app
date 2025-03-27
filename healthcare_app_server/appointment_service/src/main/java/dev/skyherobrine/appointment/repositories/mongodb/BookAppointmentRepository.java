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

    List<BookAppointment> findByStatus(AppointmentStatus status);

    Optional<BookAppointment> findFirstByWorkScheduleOrderByNumericalOrderDesc(Long workSchedule);

    List<BookAppointment> findByWorkSchedule(Long workSchedule);

    Optional<BookAppointment> findByPatientIdAndWorkSchedule(String patientId, Long workSchedule);

    List<BookAppointment> findByWorkScheduleAndStatusNot(Long workSchedule, AppointmentStatus status);

    List<BookAppointment> findByPatientId(String patientId);
}
