package dev.skyherobrine.service.repositories.mongodb;

import dev.skyherobrine.service.models.mongodb.PrivateChat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrivateChatRepository extends MongoRepository<PrivateChat,Long> {
}
