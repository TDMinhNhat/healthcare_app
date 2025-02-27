package dev.skyherobrine.service.repositories.mongodb;

import dev.skyherobrine.service.models.mongodb.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends MongoRepository<Room,Long> {
}
