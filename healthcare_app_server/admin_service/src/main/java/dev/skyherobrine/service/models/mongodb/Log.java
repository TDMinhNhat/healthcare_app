package dev.skyherobrine.service.models.mongodb;

import dev.skyherobrine.service.enums.LogAction;
import dev.skyherobrine.service.models.mariadb.User;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "logs")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class Log {
    @MongoId
    @Field(name = "log_time") @NonNull
    private LocalDateTime logTime;
    @NonNull
    private User user;
    @NonNull
    private LogAction action;
    private String description;
    @Field(name = "is_request_success") @NonNull
    private boolean isRequestSuccess;

    public Log(@NonNull LocalDateTime logTime, @NonNull User user, @NonNull LogAction action, String description, @NonNull boolean isRequestSuccess) {
        this.logTime = logTime;
        this.user = user;
        this.action = action;
        this.description = description;
        this.isRequestSuccess = isRequestSuccess;
    }
}
