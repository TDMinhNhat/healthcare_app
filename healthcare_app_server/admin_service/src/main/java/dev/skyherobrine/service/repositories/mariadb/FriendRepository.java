package dev.skyherobrine.service.repositories.mariadb;

import dev.skyherobrine.service.keys.FriendKey;
import dev.skyherobrine.service.models.mariadb.Friend;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendRepository extends PagingAndSortingRepository<Friend, FriendKey> {
}
