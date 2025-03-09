package dev.skyherobrine.admin.models.mongodb;

import dev.skyherobrine.admin.enums.TypeDay;
import dev.skyherobrine.admin.models.mariadb.Doctor;
import dev.skyherobrine.admin.models.mariadb.Shift;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "work_schedules")
@Getter @Setter
@NoArgsConstructor
public class WorkSchedule {
    @MongoId
    private Long id;
    private Doctor doctor;
    @Field(name = "type_day")
    private TypeDay typeDay;
    private Shift shift;
    @Field(name = "created_at")
    private String createdAt;
    @Field(name = "updated_at")
    private String updatedAt;
    private boolean status;

    public WorkSchedule(Long id, Doctor doctor, TypeDay typeDay, Shift shift) {
        this.id = id;
        this.doctor = doctor;
        this.typeDay = typeDay;
        this.shift = shift;
        this.createdAt = this.updatedAt = LocalDateTime.now();
        this.status = true;
    }
}
