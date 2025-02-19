package dev.skyherobrine.service.repositories.mongodb;

import dev.skyherobrine.service.models.mongodb.GroupChat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupChatRepository extends MongoRepository<GroupChat,Long> {
}
