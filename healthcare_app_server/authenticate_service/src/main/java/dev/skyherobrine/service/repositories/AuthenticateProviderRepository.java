package dev.skyherobrine.service.repositories;

import dev.skyherobrine.service.models.AuthenticateProvider;
import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthenticateProviderRepository extends CrudRepository<AuthenticateProvider,Long> {

    Optional<AuthenticateProvider> findAuthenticateProviderByAuthenName(@NonNull String authenName);
}
