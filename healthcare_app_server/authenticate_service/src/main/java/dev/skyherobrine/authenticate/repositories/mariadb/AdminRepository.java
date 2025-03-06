package dev.skyherobrine.authenticate.repositories.mariadb;

import dev.skyherobrine.authenticate.models.mariadb.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin,Long> {
}
