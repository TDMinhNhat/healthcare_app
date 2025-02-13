package dev.skyherobrine.service.repositories.mariadb;

import dev.skyherobrine.service.models.mariadb.UserRole;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends CrudRepository<UserRole,Long> {

    List<UserRole> findUserRolesByStatus(boolean status);
}
