package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.UserRole;
import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRoleRepository extends CrudRepository<UserRole,Long> {
    Optional<UserRole> findUserRoleByRoleName(@NonNull String roleName);
}
