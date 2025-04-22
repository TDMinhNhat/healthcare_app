package dev.skyherobrine.appointment.repositories.mariadb;

import dev.skyherobrine.appointment.models.mariadb.Price;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PriceRepository extends JpaRepository<Price,Long> {

    @Query("select p from Price p where p.priceType = ?1 and p.status = true")
    Optional<Price> getCurrentPriceByPriceType(String priceType);
}
