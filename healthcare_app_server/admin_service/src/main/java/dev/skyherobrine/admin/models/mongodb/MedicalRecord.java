package dev.skyherobrine.admin.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "medical_records")
@Getter @Setter
@NoArgsConstructor @RequiredArgsConstructor @AllArgsConstructor
public class MedicalRecord {

    @MongoId
    private Long id;

    @NonNull
    private Appointment appointment;

    @Field(name = "diagnosis_disease") @NonNull
    private String diagnosisDisease;

    private String note;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Field(name = "re_examination_date") @NonNull
    private LocalDate reExaminationDate;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Field(name = "created_at")
    private LocalDateTime createdAt;

    public MedicalRecord(@NonNull Appointment appointment, @NonNull String diagnosisDisease, String note, @NonNull LocalDate reExaminationDate) {
        this.appointment = appointment;
        this.diagnosisDisease = diagnosisDisease;
        this.note = note;
        this.reExaminationDate = reExaminationDate;
        this.createdAt = LocalDateTime.now();
    }
}
