package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.Doctor;
import dev.skyherobrine.service.models.DoctorEducation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorEducationRepository extends JpaRepository<DoctorEducation,Long> {
    List<DoctorEducation> findByDoctor(Doctor doctor);

}
