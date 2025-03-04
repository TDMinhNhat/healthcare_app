package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.enums.AppointmentStatus;
import dev.skyherobrine.service.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment,Long> {
    List<Appointment> findByPatient(String patient);

    Optional<Appointment> findAppointmentByRoomId(String roomId);

    List<Appointment> findByStatus(AppointmentStatus status);

    List<Appointment> findByPatientAndStatus(String patient, AppointmentStatus status);

    @Transactional
    @Modifying
    @Query("update Appointment a set a.status = 3 where a.roomId = ?1")
    int updateStatusByRoomId(String roomId);
}
