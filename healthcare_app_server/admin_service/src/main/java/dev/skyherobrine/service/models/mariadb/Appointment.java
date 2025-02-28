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
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss") @NonNull
    @Column(nullable = false)
    private LocalDateTime start;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss") @NonNull
    @Column(nullable = false)
    private LocalDateTime end;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Appointment(@NonNull Patient patient, @NonNull Doctor doctor, String note, @NonNull LocalDateTime start, @NonNull LocalDateTime end) {
        this.patient = patient;
        this.doctor = doctor;
        this.note = note;
        this.start = start;
        this.end = end;
    }

    @PrePersist
    public void onPersist() {
        createdAt = LocalDateTime.now();
    }
}
