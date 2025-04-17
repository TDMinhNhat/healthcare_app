package dev.skyherobrine.authenticate.repositories.mariadb;

import dev.skyherobrine.authenticate.models.mariadb.PatientAccountBank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientAccountBankRepository extends JpaRepository<PatientAccountBank,Long> {
}
