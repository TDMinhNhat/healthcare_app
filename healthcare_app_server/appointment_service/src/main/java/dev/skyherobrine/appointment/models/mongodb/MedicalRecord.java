package dev.skyherobrine.appointment.models.mongodb;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.skyherobrine.admin.models.mongodb.BookAppointment;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "medical_records")
@Getter @Setter
@NoArgsConstructor
public class MedicalRecord {

    @MongoId
    private Long id;

    @Field(name = "book_appointment")
    private BookAppointment bookAppointment;

    @Field(name = "diagnosis_disease") @NonNull
    private String diagnosisDisease;

    private String note;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Field(name = "re_examination_date") @NonNull
    private LocalDate reExaminationDate;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Field(name = "created_at")
    private LocalDateTime createdAt;

    public MedicalRecord(Long id, BookAppointment bookAppointment, @NonNull String diagnosisDisease, String note, LocalDate reExaminationDate) {
        this.id = id;
        this.bookAppointment = bookAppointment;
        this.diagnosisDisease = diagnosisDisease;
        this.note = note;
        this.reExaminationDate = reExaminationDate;
        this.createdAt = LocalDateTime.now();
    }
}
