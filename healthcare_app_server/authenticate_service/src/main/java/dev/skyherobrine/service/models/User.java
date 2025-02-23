package dev.skyherobrine.service.models;

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

    @Column(name = "first_name", length = 100, nullable = false) @NonNull
    private String firstName;

    @Column(name = "last_name", length = 100, nullable = false) @NonNull
    private String lastName;

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

    @Column(length = 50, unique = true, nullable = false) @NonNull
    private String username;

    @Column(length = 200, unique = true, nullable = false) @NonNull
    private String email;

    @Column(length = 100, nullable = false) @NonNull
    private String password;

    @Column(name = "face_image_encode", length = 60000, nullable = false) @NonNull
    private String faceImageEncode;

    @Column(length = 500)
    private String avatar;

    @ManyToOne
    @JoinColumn(name = "authed_provider_id", nullable = false)
    private AuthenticateProvider authedProvider;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified;

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
        this.emailVerified = false;
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
