package dev.skyherobrine.service.repositories.mariadb;

import dev.skyherobrine.service.models.mariadb.AuthenticateProvider;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthenticateProviderRepository extends CrudRepository<AuthenticateProvider,Long> {

    List<AuthenticateProvider> getAuthenticateProviderByStatus(boolean status);
}
