package dev.skyherobrine.admin.repositories.mariadb;

import dev.skyherobrine.admin.models.mariadb.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient,Long> {

    Optional<Patient> findPatientByUserId(String userId);

    Optional<Patient> findByEmailAndPassword(String email, String password);

    Optional<Patient> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("update Patient p set p.password = ?1 where p.email = ?2")
    int updatePassword(String password, String email);

    @Transactional
    @Modifying
    @Query("update Patient p set p.emailVerified = true where p.email = ?1")
    int updateVerifyEmail(String email);


}
