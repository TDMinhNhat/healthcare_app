package dev.skyherobrine.admin.models.mariadb;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity @Table(name = "doctors")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class Doctor extends User{

    @Column(length = 100, nullable = false) @NonNull
    private String specialization;
    @ManyToOne
    @JoinColumn(name = "type_disease", nullable = false) @NonNull
    private TypeDisease typeDisease;

    public Doctor(@NonNull String userId, @NonNull String firstName, @NonNull String lastName, @NonNull Boolean sex, @NonNull LocalDate dob, @NonNull String phone, @NonNull String email, @NonNull String password, @NonNull String specialization, @NonNull TypeDisease typeDisease) {
        super(userId, firstName, lastName, sex, dob, phone, email, "", password);
        this.specialization = specialization;
        this.typeDisease = typeDisease;
    }

    public Doctor(@NonNull String userId, @NonNull String firstName, @NonNull String lastName, @NonNull Boolean sex, @NonNull LocalDate dob, @NonNull String phone, @NonNull String email, @NonNull String password, AuthenticateProvider authedProvider, @NonNull String specialization, @NonNull TypeDisease typeDisease) {
        super(userId, firstName, lastName, sex, dob, phone, email, password, "", authedProvider);
        this.specialization = specialization;
        this.typeDisease = typeDisease;
    }
}
