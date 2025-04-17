package dev.skyherobrine.authenticate.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PatientAccountBankDTO {
    private String patientId;
    private String bankName;
    private String accountNumber;
}
