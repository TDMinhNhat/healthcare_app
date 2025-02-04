package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.HistoryDetect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoryDetectRepository extends JpaRepository<HistoryDetect,Long> {
}
