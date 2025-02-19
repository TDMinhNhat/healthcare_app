package dev.skyherobrine.service.keys;

import dev.skyherobrine.service.models.mariadb.User;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter @Setter
@NoArgsConstructor
public class FriendKey implements Serializable {

    @ManyToOne @JoinColumn(name = "user_sender_id", nullable = false)
    @NonNull
    private User sender;

    @ManyToOne @JoinColumn(name = "user_receiver_id", nullable = false)
    @NonNull
    private User receiver;
}
