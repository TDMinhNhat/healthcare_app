package dev.skyherobrine.service.repositories.mariadb;

import dev.skyherobrine.service.models.mariadb.DoctorExperience;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorExperienceRepository extends PagingAndSortingRepository<DoctorExperience,Long> {
}
