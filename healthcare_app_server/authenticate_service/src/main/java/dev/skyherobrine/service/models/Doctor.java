package dev.skyherobrine.service.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;

@Entity @Table(name = "doctors")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class Doctor extends User{

    @Column(length = 100, nullable = false) @NonNull
    private String specialization;

    public Doctor(@NonNull String userId, @NonNull String firstName, @NonNull String lastName, @NonNull Boolean sex, @NonNull LocalDate dob, @NonNull String phone, @NonNull String email, @NonNull String password, AuthenticateProvider authedProvider, @NonNull String specialization) {
        super(userId, firstName, lastName, sex, dob, phone, email, password, authedProvider);
        this.specialization = specialization;
    }

    public Doctor(@NonNull String userId, @NonNull String firstName, @NonNull String lastName, @NonNull Boolean sex, @NonNull LocalDate dob, @NonNull String phone, @NonNull String email, @NonNull String password, @NonNull String specialization) {
        super(userId, firstName, lastName, sex, dob, phone, email, password);
        this.specialization = specialization;
    }
}
