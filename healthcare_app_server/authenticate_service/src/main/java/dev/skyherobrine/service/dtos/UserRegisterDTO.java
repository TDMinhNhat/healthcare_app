package dev.skyherobrine.service.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class UserRegisterDTO {
    private String fullName;
    private Boolean sex;
    private String dob;
    private String phone;
    private String email;
    private String password;

    public LocalDate getDobLocalDate() {
        String[] splitDob = dob.split("-");
        return LocalDate.of(Integer.parseInt(splitDob[2]), Integer.parseInt(splitDob[1]), Integer.parseInt(splitDob[0]));
    }
}
