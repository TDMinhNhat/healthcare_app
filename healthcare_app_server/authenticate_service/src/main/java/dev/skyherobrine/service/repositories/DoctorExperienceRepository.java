package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.mariadb.Doctor;
import dev.skyherobrine.service.models.mariadb.DoctorExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorExperienceRepository extends JpaRepository<DoctorExperience,Long> {
    List<DoctorExperience> findByDoctor(Doctor doctor);

}
