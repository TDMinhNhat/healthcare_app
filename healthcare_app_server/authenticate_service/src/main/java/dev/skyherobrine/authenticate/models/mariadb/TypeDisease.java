package dev.skyherobrine.authenticate.models.mariadb;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity @Table(name = "type_diseases")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class TypeDisease {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 100, nullable = false, unique = true) @NonNull
    private String name;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private boolean status;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        status = true;
    }
}
