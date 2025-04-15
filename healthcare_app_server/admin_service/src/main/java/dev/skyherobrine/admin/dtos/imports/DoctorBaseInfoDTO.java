package dev.skyherobrine.admin.dtos.imports;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class DoctorBaseInfoDTO {
    private String firstName;
    private String lastName;
    private Boolean sex;
    private String dob;
    private String phone;
    private String email;
    private String password;
    private String specialization;
    private String typeDisease;
}
