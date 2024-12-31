package dev.skyherobrine.service.repositories.mariadb;

import dev.skyherobrine.service.models.mariadb.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmailAndPassword(String email, String password);

    Optional<User> findByUserId(String userId);

    Optional<User> findByEmail(String email);


}
