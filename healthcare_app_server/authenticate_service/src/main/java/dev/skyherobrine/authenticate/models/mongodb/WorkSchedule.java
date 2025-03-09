package dev.skyherobrine.authenticate.models.mongodb;

import dev.skyherobrine.admin.enums.TypeDay;
import dev.skyherobrine.admin.models.mariadb.Doctor;
import dev.skyherobrine.admin.models.mariadb.Shift;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
    @Field(name = "max_slots")
    private int maxSlots;
    @Field(name = "created_at")
    private String createdAt;
    @Field(name = "updated_at")
    private String updatedAt;
    private boolean status;

    public WorkSchedule(Long id, Doctor doctor, TypeDay typeDay, Shift shift, int maxSlots) {
        this.id = id;
        this.doctor = doctor;
        this.typeDay = typeDay;
        this.shift = shift;
        this.maxSlots = maxSlots;
        this.createdAt = this.updatedAt = LocalDateTime.now();
        this.status = true;
    }
}
