package dev.skyherobrine.service.repositories.mariadb;

import dev.skyherobrine.service.models.mariadb.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    List<User> findByStatus(boolean status);

    List<User> findByAuthedProvider_Id(Long id);

    List<User> findByRole_Id(Long id);


}
