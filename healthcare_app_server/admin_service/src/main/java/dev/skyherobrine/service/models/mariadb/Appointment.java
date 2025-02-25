package dev.skyherobrine.service.models.mariadb;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity @Table(name = "appointments")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class Appointment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(nullable = false) @NonNull
    private Patient patient;
    @ManyToOne @JoinColumn(nullable = false) @NonNull
    private Doctor doctor;
    @Column(length = 500)
    private String note;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(nullable = false)
    private LocalDateTime start;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(nullable = false)
    private LocalDateTime end;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onPersist() {
        createdAt = LocalDateTime.now();
    }
}
