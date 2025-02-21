package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmailAndPassword(String email, String password);

    Optional<User> findByUserId(String userId);

    Optional<User> findByEmail(String email);

    @Query("""
            select u from User u
            where upper(u.userId) like upper(concat('%', ?1, '%')) or upper(u.firstName) like upper(concat('%', ?1, '%')) or upper(u.phone) like upper(concat('%', ?1, '%')) or upper(u.username) like upper(concat('%', ?1, '%')) or upper(u.email) like upper(concat('%', ?2, '%'))
            order by u.id""")
    List<User> findUsersBySearchInput(String input, String inputEmailEncode);


}
