package dev.skyherobrine.admin.models.mongodb;

import dev.skyherobrine.admin.models.mariadb.Doctor;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Document(collection = "work_schedules")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class WorkSchedule {
    @MongoId @NonNull
    private Long id;
    @NonNull
    private Doctor doctor;
    private String start;
    private String end;
    private String createdAt;
    private String updatedAt;

    public WorkSchedule(@NonNull Long id, @NonNull Doctor doctor, @NonNull String start, @NonNull String end) {
        this.id = id;
        this.doctor = doctor;
        this.start = start;
        this.end = end;
        this.createdAt = this.updatedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy-HH-mm-ss"));
    }
}
