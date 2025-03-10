package dev.skyherobrine.appointment.repositories.mongodb;

import dev.skyherobrine.appointment.enums.AppointmentStatus;
import dev.skyherobrine.appointment.models.mongodb.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment,Long> {
    Optional<Appointment> findFirstByOrderByIdDesc();

    List<Appointment> findByWorkScheduleId(Long workScheduleId);

}
