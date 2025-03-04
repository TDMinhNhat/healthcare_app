package dev.skyherobrine.service.models.mariadb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.service.enums.AppointmentStatus;
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
    @ManyToOne @JoinColumn(name = "work_schedule_id", nullable = false) @NonNull
    private WorkSchedule workSchedule;
    @Column(length = 500)
    private String note;
    @Column(name = "room_id", length = 50, nullable = false)
    private String roomId;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private AppointmentStatus status;

    public Appointment(@NonNull Patient patient, @NonNull WorkSchedule workSchedule, String note, String roomId) {
        this.patient = patient;
        this.workSchedule = workSchedule;
        this.note = note;
        this.roomId = roomId;
    }

    @PrePersist
    public void onPersist() {
        createdAt = LocalDateTime.now();
        status = AppointmentStatus.WAITING;
    }
}
