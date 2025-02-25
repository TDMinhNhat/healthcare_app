package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.mariadb.DoctorEducation;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorEducationRepository extends PagingAndSortingRepository<DoctorEducation,Long> {
}
