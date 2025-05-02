package dev.skyherobrine.admin.repositories.mongodb;

import dev.skyherobrine.admin.models.mongodb.Emergency;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmergencyRepository extends MongoRepository<Emergency,Long> {
    Optional<Emergency> findTopByOrderByIdDesc();
}
