package dev.skyherobrine.authenticate.repositories.mariadb;

import dev.skyherobrine.authenticate.models.mariadb.Address;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends CrudRepository<Address,Long> {
    Address findByid(Long id);
}
