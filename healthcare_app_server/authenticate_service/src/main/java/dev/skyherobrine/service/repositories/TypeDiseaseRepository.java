package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.TypeDisease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TypeDiseaseRepository extends JpaRepository<TypeDisease,Long> {
    Optional<TypeDisease> findByName(String name);


}
