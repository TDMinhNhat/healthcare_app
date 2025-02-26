package dev.skyherobrine.service.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.service.models.Appointment;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "medical_records")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class MedicalRecord {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(nullable = false) @NonNull
    private Appointment appointment;

    @Column(name = "diagnosis_disease", length = 300) @NonNull
    private String diagnosisDisease;

    @Column(length = 500)
    private String note;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Column(name = "re_examination_date", nullable = false) @NonNull
    private LocalDate reExaminationDate;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Column(name = "created_at", nullable = false) @NonNull
    private LocalDateTime createdAt;
}
