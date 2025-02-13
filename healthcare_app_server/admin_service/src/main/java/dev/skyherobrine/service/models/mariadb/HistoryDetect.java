package dev.skyherobrine.service.models.mariadb;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity @Table(name = "history_detects")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class HistoryDetect {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne @JoinColumn(name = "user_id", nullable = false) @NonNull
    private User user;
    @ManyToOne @JoinColumn(name = "type_detect_id", nullable = false) @NonNull
    private TypeDetect typeDetect;
    @Column(name = "image_detects", nullable = false, unique = true) @NonNull
    private String imageDetect;
    @Column(name = "is_success", nullable = false) @NonNull
    private Boolean success;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onPrePersist() {
        createdAt = LocalDateTime.now();
    }
}
