package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.UserRole;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends CrudRepository<UserRole,Long> {
}
