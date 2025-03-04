package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.PatientFaceEncode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientFaceEncodeRepository extends JpaRepository<PatientFaceEncode,Long> {
}
