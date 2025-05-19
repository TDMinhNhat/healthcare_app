package dev.skyherobrine.appointment.repositories.mariadb;

import dev.skyherobrine.appointment.models.mariadb.Price;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PriceRepository extends JpaRepository<Price,Long> {

    @Query("select p from Price p where p.priceType = :priceType and p.status = true")
    Optional<Price> getCurrentPriceByPriceType(@Param("priceType") String priceType);
}
