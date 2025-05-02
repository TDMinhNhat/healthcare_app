package dev.skyherobrine.authenticate.models.mariadb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.authenticate.enums.Diploma;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "doctor_educations")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class DoctorEducation {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(nullable = false) @NonNull
    private Doctor doctor;

    @Column(name = "school_name", length = 200, nullable = false) @NonNull
    private String schoolName;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Column(name = "join_date", nullable = false) @NonNull
    private LocalDate joinDate;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Column(name = "graduate_date", nullable = false) @NonNull
    private LocalDate graduateDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false) @NonNull
    private Diploma diploma;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onPersist() {
        createdAt = LocalDateTime.now();
    }
}
