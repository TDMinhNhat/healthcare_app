package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.DoctorExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorExperienceRepository extends JpaRepository<DoctorExperience,Long> {
}
