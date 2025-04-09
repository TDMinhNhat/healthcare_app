package dev.skyherobrine.admin.models.mongodb;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "emergencies")
@Getter @Setter
public class Emergency {

    @MongoId
    private Long id;
    private String patientId;
    private String doctorId;
    private LocalDateTime createdAt;

    public Emergency(Long id) {
        this.id = id;
        this.createdAt = LocalDateTime.now();
    }

    public Emergency(Long id, String patientId, String doctorId) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.createdAt = LocalDateTime.now();
    }
}
