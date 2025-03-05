package dev.skyherobrine.service.repositories.mongodb;

import dev.skyherobrine.service.enums.AppointmentStatus;
import dev.skyherobrine.service.models.mongodb.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment,Long> {
    List<Appointment> findByPatient(String patient);

    Optional<Appointment> findAppointmentByRoomId(String roomId);

    List<Appointment> findByStatus(AppointmentStatus status);

    List<Appointment> findByPatientAndStatus(String patient, AppointmentStatus status);
}
