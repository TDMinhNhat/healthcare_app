package dev.skyherobrine.service.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.service.enums.AppointmentStatus;
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
    @Column(name = "work_schedule_id", nullable = false) @NonNull
    private Long workSchedule;
    @Column(length = 500)
    private String note;
    @Column(name = "room_id", nullable = false)
    private String roomId;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private AppointmentStatus status;

    @PrePersist
    public void onPersist() {
        createdAt = LocalDateTime.now();
    }

    public Appointment(@NonNull String patient, @NonNull Long workSchedule, String note) {
        this.patient = patient;
        this.workSchedule = workSchedule;
        this.note = note;
        this.status = AppointmentStatus.WAITING;
    }
}
