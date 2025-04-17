package dev.skyherobrine.admin.models.mariadb;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity @Table(name = "patient_account_banks")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class PatientAccountBank {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne @JoinColumn(name = "patient_id", referencedColumnName = "id", nullable = false) @NonNull
    private Patient patient;
    @Column(name = "bank_name", nullable = false, length = 100) @NonNull
    private String bankName;
    @Column(name = "account_number", nullable = false, length = 100) @NonNull
    private String accountNumber;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
