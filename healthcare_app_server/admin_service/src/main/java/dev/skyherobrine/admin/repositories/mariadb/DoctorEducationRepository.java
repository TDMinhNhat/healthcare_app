package dev.skyherobrine.admin.repositories.mariadb;

import dev.skyherobrine.admin.models.mariadb.DoctorEducation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorEducationRepository extends JpaRepository<DoctorEducation,Long> {
}
