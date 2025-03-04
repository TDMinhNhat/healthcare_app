package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.mongodb.WorkSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkScheduleRepository extends JpaRepository<WorkSchedule,Long> {
}
