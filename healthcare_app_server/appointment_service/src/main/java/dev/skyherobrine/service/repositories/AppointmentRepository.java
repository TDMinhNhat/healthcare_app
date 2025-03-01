package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.enums.AppointmentStatus;
import dev.skyherobrine.service.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment,Long> {
    List<Appointment> findByPatient(String patient);

    List<Appointment> findByDoctor(String doctor);

    @Query("SELECT a.doctor FROM Appointment a WHERE DAY(?1) = DAY(a.start) AND MONTH(?1) = MONTH(a.start) AND YEAR(?1) = YEAR(a.start) AND HOUR(?1) = HOUR(a.start)")
    List<String> findDoctorFreeStartTime(LocalDateTime start);

    Optional<Appointment> findAppointmentByRoomId(String roomId);

    List<Appointment> findByStatus(AppointmentStatus status);

    List<Appointment> findByPatientAndStatus(String patient, AppointmentStatus status);


}
