package dev.skyherobrine.service.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    private Instant start;
    @NonNull
    private Instant end;
    @NonNull
    private Instant createdAt;
    @NonNull
    private Instant updatedAt;

    public WorkSchedule(@NonNull Doctor doctor, @NonNull Instant start, @NonNull Instant end) {
        this.doctor = doctor;
        this.start = start;
        this.end = end;
        this.createdAt = this.updatedAt = Instant.now();
    }
}
