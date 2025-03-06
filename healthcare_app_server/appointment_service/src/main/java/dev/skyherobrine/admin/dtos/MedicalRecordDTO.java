package dev.skyherobrine.admin.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@AllArgsConstructor
public class MedicalRecordDTO {
    private String roomId;
    private String diagnosisDisease;
    private String note;
    private String reExaminationDate;
    private List<MedicalRecordDrugDTO> drugs;

    @Getter @Setter
    @AllArgsConstructor
    public static class MedicalRecordDrugDTO {
        private Long drugId;
        private Double quantity;
        private String howUse;
    }
}
