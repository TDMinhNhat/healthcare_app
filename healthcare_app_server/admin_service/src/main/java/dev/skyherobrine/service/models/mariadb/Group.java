package dev.skyherobrine.service.models.mariadb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.service.enums.GroupStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "groups")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class Group {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "group_id", length = 15, nullable = false, unique = true)
    private String groupId;
    @Column(name = "group_name", length = 100, nullable = false) @NonNull
    private String groupName;
    @Column(name = "group_description", length = 1000)
    private String groupDescription;
    @Column(name = "allow_join", nullable = false)
    private Boolean allowJoin;
    @Column(name = "allow_invite", nullable = false)
    private Boolean allowInvite;
    @Column(name = "allow_notification", nullable = false)
    private Boolean allowNotification;
    @Column(name = "allow_chat", nullable = false)
    private Boolean allowChat;
    @Column(name = "wait_for_response", nullable = false)
    private Boolean waitForResponse;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss")
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private GroupStatus status;

    @PrePersist
    public void onPersist() {
        createdAt = updatedAt = LocalDateTime.now();
        allowJoin = allowInvite = allowNotification = allowChat = true;
        waitForResponse = false;
        status = GroupStatus.ACTIVE;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
