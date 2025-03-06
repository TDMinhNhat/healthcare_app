package dev.skyherobrine.admin.models.mariadb;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

import java.time.LocalDate;

@Entity @Table(name = "admins")
@Getter @Setter
@NoArgsConstructor
public class Admin extends User{

    public Admin(@NonNull String userId, @NonNull String firstName, @NonNull String lastName, @NonNull Boolean sex, @NonNull LocalDate dob, @NonNull String phone, @NonNull String email, @NonNull String password) {
        super(userId, firstName, lastName, sex, dob, phone, email, password);
    }

    public Admin(@NonNull String userId, @NonNull String firstName, @NonNull String lastName, @NonNull Boolean sex, @NonNull LocalDate dob, @NonNull String phone, @NonNull String email, @NonNull String password, AuthenticateProvider authedProvider) {
        super(userId, firstName, lastName, sex, dob, phone, email, password, authedProvider);
    }
}
