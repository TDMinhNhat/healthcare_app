package dev.skyherobrine.service.models.mariadb;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity @Table(name = "drugs")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class Drug {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "drug_name", length = 150, nullable = false) @NonNull
    private String drugName;

    @Column(name = "drug_type", length = 300, nullable = false) @NonNull
    private String drugType;

    @Column(length = 50, nullable = false) @NonNull
    private String unit;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onPersist() {
        createdAt = LocalDateTime.now();
    }
}
