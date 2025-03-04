package dev.skyherobrine.service.repositories.mariadb;

import dev.skyherobrine.service.models.mariadb.WorkSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkScheduleRepository extends JpaRepository<WorkSchedule,Long> {
}
