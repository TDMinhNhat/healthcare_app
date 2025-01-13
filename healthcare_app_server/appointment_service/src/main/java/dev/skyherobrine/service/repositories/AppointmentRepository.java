package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, LocalDateTime> {
}
