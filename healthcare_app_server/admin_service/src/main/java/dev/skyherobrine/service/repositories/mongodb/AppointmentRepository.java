package dev.skyherobrine.service.repositories.mongodb;

import dev.skyherobrine.service.models.mongodb.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment,Long> {
    Optional<Appointment> findAppointmentByRoomId(String roomId);
}
