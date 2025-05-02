package dev.skyherobrine.admin.repositories.mariadb;

import dev.skyherobrine.admin.models.mariadb.DoctorCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorCertificateRepository extends JpaRepository<DoctorCertificate,Long> {
}
