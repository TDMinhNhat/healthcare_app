package dev.skyherobrine.service.repositories.mongodb;

import dev.skyherobrine.service.models.mongodb.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage,Long> {
}
