package dev.skyherobrine.service.models.mariadb;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity @Table(name = "patient_face_encodes")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class PatientFaceEncode {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne @JoinColumn(name = "patient_id", nullable = false) @NonNull
    private Patient patient;
    @Column(name = "left_encode", length = 5000, nullable = false) @NonNull
    private String leftEncode;
    @Column(name = "right_encode", length = 5000, nullable = false) @NonNull
    private String rightEncode;
    @Column(name = "in_front_of_encode", length = 5000, nullable = false) @NonNull
    private String inFrontOfEncode;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
