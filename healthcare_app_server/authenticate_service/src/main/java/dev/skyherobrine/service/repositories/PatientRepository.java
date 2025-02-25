package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient,Long> {
    Optional<Patient> findByEmailAndPassword(String email, String password);

}
