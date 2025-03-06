package dev.skyherobrine.authenticate.repositories.mariadb;

import dev.skyherobrine.authenticate.models.mariadb.PatientFaceEncode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientFaceEncodeRepository extends JpaRepository<PatientFaceEncode,Long> {
}
