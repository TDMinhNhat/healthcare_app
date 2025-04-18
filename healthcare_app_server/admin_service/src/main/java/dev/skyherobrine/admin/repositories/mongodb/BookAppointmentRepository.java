package dev.skyherobrine.admin.repositories.mongodb;

import dev.skyherobrine.admin.enums.AppointmentStatus;
import dev.skyherobrine.admin.models.mongodb.BookAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookAppointmentRepository extends MongoRepository<BookAppointment,Long> {
    Optional<BookAppointment> findByPatient_UserIdAndWorkSchedule_Id(String userId, Long id);

    List<BookAppointment> findByStatus(AppointmentStatus status);
}
