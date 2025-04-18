package dev.skyherobrine.authenticate.repositories.mariadb;

import dev.skyherobrine.authenticate.models.mariadb.Patient;
import dev.skyherobrine.authenticate.models.mariadb.PatientAccountBank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientAccountBankRepository extends JpaRepository<PatientAccountBank,Long> {
    Optional<PatientAccountBank> findByPatient(Patient patient);
}
