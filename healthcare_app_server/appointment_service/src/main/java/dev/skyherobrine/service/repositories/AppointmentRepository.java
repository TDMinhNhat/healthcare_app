package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment,Long> {
    List<Appointment> findByPatient(String patient);

    List<Appointment> findByDoctor(String doctor);
}
