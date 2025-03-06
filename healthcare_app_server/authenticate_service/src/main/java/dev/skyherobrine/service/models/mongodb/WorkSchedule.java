package dev.skyherobrine.service.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.service.models.mariadb.Doctor;
import lombok.*;
import org.bouncycastle.util.Times;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.sql.Timestamp;
import java.time.Instant;
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
