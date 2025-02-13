package dev.skyherobrine.service.repositories.mariadb;

import dev.skyherobrine.service.models.mariadb.HistoryDetect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoryDetectRepository extends JpaRepository<HistoryDetect,Long> {
}
