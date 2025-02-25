package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.mariadb.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient,Long> {
}
