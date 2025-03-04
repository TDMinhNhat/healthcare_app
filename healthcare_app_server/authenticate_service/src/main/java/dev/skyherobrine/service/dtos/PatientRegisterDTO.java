package dev.skyherobrine.service.dtos;

import dev.skyherobrine.service.models.mariadb.Patient;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class PatientRegisterDTO {
    private String firstName;
    private String lastName;
    private Boolean sex;
    private String dob;
    private String phone;
    private String username;
    private String email;
    private String password;

    public LocalDate getDobLocalDate() {
        String[] splitDob = dob.split("-");
        return LocalDate.of(Integer.parseInt(splitDob[2]), Integer.parseInt(splitDob[1]), Integer.parseInt(splitDob[0]));
    }

    public Patient toObject() {
        return new Patient(
            "123", firstName, lastName, sex, getDobLocalDate(), phone, email, password
        );
    }
}
