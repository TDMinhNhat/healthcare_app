package dev.skyherobrine.admin.repositories.mariadb;

import dev.skyherobrine.admin.models.mariadb.Patient;
import dev.skyherobrine.admin.models.mariadb.PatientAccountBank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientAccountBankRepository extends JpaRepository<PatientAccountBank,Long> {
    Optional<PatientAccountBank> findByPatient(Patient patient);
}
