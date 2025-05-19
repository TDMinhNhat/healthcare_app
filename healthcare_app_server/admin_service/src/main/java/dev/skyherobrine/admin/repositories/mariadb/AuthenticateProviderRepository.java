package dev.skyherobrine.admin.repositories.mariadb;

import dev.skyherobrine.admin.models.mariadb.AuthenticateProvider;
import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthenticateProviderRepository extends CrudRepository<AuthenticateProvider,Long> {

    List<AuthenticateProvider> getAuthenticateProviderByStatus(boolean status);

    Optional<AuthenticateProvider> findByAuthenName(@NonNull String authenName);
}
