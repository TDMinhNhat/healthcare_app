package dev.skyherobrine.authenticate.repositories.mariadb;

import dev.skyherobrine.authenticate.models.mariadb.Doctor;
import dev.skyherobrine.authenticate.models.mariadb.DoctorEducation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorEducationRepository extends JpaRepository<DoctorEducation,Long> {
    List<DoctorEducation> findByDoctor(Doctor doctor);

}
