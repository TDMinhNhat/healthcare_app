package dev.skyherobrine.admin.models.mariadb;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity @Table(name = "shifts")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class Shift {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) @NonNull
    private Integer shift;

    @JsonFormat(pattern = "HH-mm-ss")
    @Column(nullable = false) @NonNull
    private LocalTime start;

    @JsonFormat(pattern = "HH-mm-ss")
    @Column(nullable = false) @NonNull
    private LocalTime end;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private boolean status;

    @PrePersist
    public void onPrePersist() {
        createdAt = updatedAt = LocalDateTime.now();
        status = true;
    }
}
