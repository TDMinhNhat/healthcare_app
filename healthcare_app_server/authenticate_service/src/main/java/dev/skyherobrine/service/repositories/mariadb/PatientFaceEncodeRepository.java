package dev.skyherobrine.service.repositories.mariadb;

import dev.skyherobrine.service.models.mariadb.PatientFaceEncode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientFaceEncodeRepository extends JpaRepository<PatientFaceEncode,Long> {
}
