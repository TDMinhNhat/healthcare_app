package dev.skyherobrine.admin.models.mariadb;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@MappedSuperclass
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public abstract class User {
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

    @Column(length = 200, unique = true, nullable = false) @NonNull
    private String email;

    @Column(length = 100, nullable = false) @NonNull
    private String password;

    @Column(length = 500)
    private String avatar;

    @ManyToOne
    @JoinColumn(name = "authed_provider_id", nullable = false)
    private AuthenticateProvider authedProvider;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified;

    @Column(nullable = false)
    private boolean status;

    @Column(name = "face_encode_value", length = 5000)
    private String faceEncodeValue;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public User(@NonNull String userId, @NonNull String firstName, @NonNull String lastName, @NonNull Boolean sex, @NonNull LocalDate dob, @NonNull String phone, @NonNull String email, @NonNull String password, AuthenticateProvider authedProvider) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.sex = sex;
        this.dob = dob;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.authedProvider = authedProvider;
        this.address = new Address();
    }

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
