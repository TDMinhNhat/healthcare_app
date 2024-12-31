package dev.skyherobrine.service.models.mariadb;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "user_roles")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class UserRole {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "role_name", length = 100, nullable = false, unique = true) @NonNull
    private String roleName;
    @Column(nullable = false)
    private boolean status;

    @PrePersist
    public void onPersist() {
        status = true;
    }
}
