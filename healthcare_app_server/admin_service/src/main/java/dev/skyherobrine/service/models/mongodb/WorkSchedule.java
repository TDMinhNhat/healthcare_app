package dev.skyherobrine.service.models.mongodb;

import dev.skyherobrine.service.models.mariadb.Doctor;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.Instant;

@Document(collection = "work_schedules")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor @AllArgsConstructor
public class WorkSchedule {
    @MongoId
    private Long id;
    @NonNull
    private Doctor doctor;
    @NonNull
    private String start;
    @NonNull
    private String end;
    @NonNull
    private String createdAt;
    @NonNull
    private String updatedAt;
}
