package dev.skyherobrine.authenticate.repositories.mariadb;

import dev.skyherobrine.authenticate.models.mariadb.TypeDisease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TypeDiseaseRepository extends JpaRepository<TypeDisease,Long> {
    Optional<TypeDisease> findByName(String name);


}
