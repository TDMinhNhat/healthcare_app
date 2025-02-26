package dev.skyherobrine.service.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity @Table(name = "appointments")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class Appointment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "patient_id", length = 50, nullable = false) @NonNull
    private String patient;
    @Column(name = "doctor_id", length = 50, nullable = false) @NonNull
    private String doctor;
    @Column(length = 500)
    private String note;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(nullable = false) @NonNull
    private LocalDateTime start;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(nullable = false) @NonNull
    private LocalDateTime end;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onPersist() {
        createdAt = LocalDateTime.now();
    }

    public Appointment(@NonNull String patient, @NonNull String doctor, String note, @NonNull LocalDateTime start, @NonNull LocalDateTime end) {
        this.patient = patient;
        this.doctor = doctor;
        this.note = note;
        this.start = start;
        this.end = end;
    }
}
