package dev.skyherobrine.service.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.service.enums.TypeDay;
import dev.skyherobrine.service.models.mariadb.Doctor;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "work_schedules")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor
public class WorkSchedule {
    @MongoId
    private Long id;
    @NonNull
    private Doctor doctor;
    @NonNull
    private TypeDay typeDay;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss") @NonNull
    private LocalDateTime start;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss") @NonNull
    private LocalDateTime end;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss") @NonNull
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "dd-MM-yyyy-HH-mm-ss") @NonNull
    private LocalDateTime updatedAt;
}
