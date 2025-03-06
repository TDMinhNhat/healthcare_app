package dev.skyherobrine.admin.models.mongodb;

import dev.skyherobrine.admin.models.mariadb.Doctor;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

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
