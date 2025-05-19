package dev.skyherobrine.authenticate.repositories.mariadb;

import dev.skyherobrine.authenticate.models.mariadb.Doctor;
import dev.skyherobrine.authenticate.models.mariadb.DoctorCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorCertificateRepository extends JpaRepository<DoctorCertificate,Long> {
    List<DoctorCertificate> findByDoctor(Doctor doctor);

}
