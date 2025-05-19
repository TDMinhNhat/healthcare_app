package dev.skyherobrine.admin.repositories.mariadb;

import dev.skyherobrine.admin.models.mariadb.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift,Long> {
    List<Shift> findAllByStatus(boolean status);
}
