package dev.skyherobrine.service.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "doctor_certificates")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class DoctorCertificate {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(nullable = false) @NonNull
    private Doctor doctor;

    @Column(name = "cert_name", length = 150, nullable = false) @NonNull
    private String certName;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Column(name = "issue_date", nullable = false) @NonNull
    private LocalDate issueDate;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onPersist() {
        createdAt = LocalDateTime.now();
    }
}
