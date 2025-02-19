package dev.skyherobrine.service.models.mariadb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.service.enums.FriendStatus;
import dev.skyherobrine.service.keys.FriendKey;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity @Table(name = "friends")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class Friend {

    @EmbeddedId @NonNull
    private FriendKey id;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private FriendStatus status;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onPersist() {
        createdAt = updatedAt = LocalDateTime.now();
        status = FriendStatus.PENDING;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
