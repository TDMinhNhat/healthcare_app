package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.mariadb.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor,Long> {
}
