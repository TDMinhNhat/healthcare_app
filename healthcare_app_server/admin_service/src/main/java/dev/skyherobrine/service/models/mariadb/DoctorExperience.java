package dev.skyherobrine.service.models.mariadb;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "doctor_experiences")
@Getter @Setter @NoArgsConstructor @RequiredArgsConstructor
public class DoctorExperience {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(nullable = false) @NonNull
    private Doctor doctor;

    @Column(name = "company_name", length = 100, nullable = false) @NonNull
    private String companyName;

    @Column(length = 150, nullable = false) @NonNull
    private String specialization;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Column(name = "start_date", nullable = false) @NonNull
    private LocalDate startDate;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Column(name = "end_date", nullable = false) @NonNull
    private LocalDate endDate;

    @ManyToOne @JoinColumn(name = "comp_address_id", nullable = false) @NonNull
    private Address compAddress;

    @Column(length = 500)
    private String description;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    public DoctorExperience(@NonNull Doctor doctor, @NonNull String companyName, @NonNull String specialization, @NonNull LocalDate startDate, @NonNull LocalDate endDate, @NonNull Address compAddress, String description) {
        this.doctor = doctor;
        this.companyName = companyName;
        this.specialization = specialization;
        this.startDate = startDate;
        this.endDate = endDate;
        this.compAddress = compAddress;
        this.description = description;
    }
}
