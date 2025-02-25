package dev.skyherobrine.service.repositories.mongodb;

import dev.skyherobrine.service.models.mongodb.Call;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CallRepository extends MongoRepository<Call,Long> {
}
