package dev.skyherobrine.admin.repositories.mongodb;

import dev.skyherobrine.admin.models.mongodb.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment,Long> {
    Optional<Appointment> findAppointmentByRoomId(String roomId);

    Optional<Appointment> findTopByOrderByIdDesc();
}
