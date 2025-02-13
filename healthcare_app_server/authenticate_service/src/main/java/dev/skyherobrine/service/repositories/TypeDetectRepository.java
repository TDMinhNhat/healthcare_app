package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.TypeDetect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeDetectRepository extends JpaRepository<TypeDetect,Long> {
}
