package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.AuthenticateProvider;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthenticateProviderRepository extends CrudRepository<AuthenticateProvider,Long> {
}
