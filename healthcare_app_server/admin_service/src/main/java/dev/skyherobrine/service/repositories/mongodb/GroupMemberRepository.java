package dev.skyherobrine.service.repositories.mongodb;

import dev.skyherobrine.service.models.mongodb.GroupMember;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupMemberRepository extends MongoRepository<GroupMember,Long> {
}
