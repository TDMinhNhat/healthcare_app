package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.enums.AppointmentStatus;
import dev.skyherobrine.service.models.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, LocalDateTime> {

    List<Appointment> findByUserId(Long userId);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByUserIdAndDoctorId(Long userId, Long doctorId);

    List<Appointment> findByStatus(AppointmentStatus status);

    List<Appointment> findByUserIdAndStatus(Long userId, AppointmentStatus status);

    List<Appointment> findByDoctorIdAndStatus(Long doctorId, AppointmentStatus status);
}
