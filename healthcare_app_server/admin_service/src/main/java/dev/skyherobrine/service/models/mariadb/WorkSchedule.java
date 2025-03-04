package dev.skyherobrine.service.models.mariadb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.service.enums.TypeDay;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity @Table(name = "work_schedule")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class WorkSchedule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "doctor_id", nullable = false) @NonNull
    private Doctor doctor;
    @Enumerated(EnumType.STRING)
    @Column(name = "type_day", nullable = false) @NonNull
    private TypeDay typeDay;
    @JsonFormat(pattern = "HH:mm") @NonNull
    @Column(nullable = false)
    private LocalDateTime start;
    @JsonFormat(pattern = "HH:mm") @NonNull
    @Column(nullable = false)
    private LocalDateTime end;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
