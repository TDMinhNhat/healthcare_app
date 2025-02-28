package dev.skyherobrine.service.repositories.mariadb;

import dev.skyherobrine.service.models.mariadb.DoctorCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorCertificateRepository extends JpaRepository<DoctorCertificate,Long> {
}
