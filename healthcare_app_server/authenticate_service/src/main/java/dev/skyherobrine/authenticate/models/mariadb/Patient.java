package dev.skyherobrine.authenticate.models.mariadb;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

import java.time.LocalDate;

@Entity @Table(name = "patients")
@Getter @Setter
@NoArgsConstructor
public class Patient extends User{

    public Patient(@NonNull String userId, @NonNull String firstName, @NonNull String lastName, @NonNull Boolean sex, @NonNull LocalDate dob, @NonNull String phone, @NonNull String email, @NonNull String password, @NonNull String faceEncodeValue) {
        super(userId, firstName, lastName, sex, dob, phone, email, password, faceEncodeValue);
    }

    public Patient(@NonNull String userId, @NonNull String firstName, @NonNull String lastName, @NonNull Boolean sex, @NonNull LocalDate dob, @NonNull String phone, @NonNull String email, @NonNull String password, @NonNull String faceEncodeValue, AuthenticateProvider authedProvider) {
        super(userId, firstName, lastName, sex, dob, phone, email, password, faceEncodeValue, authedProvider);
    }
}
