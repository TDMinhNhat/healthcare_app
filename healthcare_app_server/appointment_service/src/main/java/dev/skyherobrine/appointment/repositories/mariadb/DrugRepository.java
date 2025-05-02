package dev.skyherobrine.appointment.repositories.mariadb;

import dev.skyherobrine.appointment.models.mariadb.Drug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DrugRepository extends JpaRepository<Drug,Long> {
    List<Drug> findByDrugNameContains(@NonNull String drugName);
}
