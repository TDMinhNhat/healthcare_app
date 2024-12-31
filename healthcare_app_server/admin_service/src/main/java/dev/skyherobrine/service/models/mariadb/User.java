package dev.skyherobrine.service.models.mariadb;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "users")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", length = 50, unique = true, nullable = false) @NonNull
    private String userId;

    @Column(name = "full_name", length = 200, nullable = false) @NonNull
    private String fullName;

    @Column(nullable = false) @NonNull
    private Boolean sex;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Column(nullable = false)
    @NonNull
    private LocalDate dob;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;

    @Column(length = 20, nullable = false) @NonNull
    private String phone;

    @Column(length = 200, unique = true, nullable = false) @NonNull
    private String email;

    @Column(length = 100, nullable = false) @NonNull
    private String password;

    @Column(length = 500)
    private String avatar;

    @ManyToOne
    @JoinColumn(name = "authed_provider_id", nullable = false)
    private AuthenticateProvider authedProvider;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private UserRole role;

    @Column(nullable = false)
    private boolean status;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.status = true;
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
