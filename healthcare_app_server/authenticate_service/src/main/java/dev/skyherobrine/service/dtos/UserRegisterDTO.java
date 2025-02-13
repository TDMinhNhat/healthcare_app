package dev.skyherobrine.service.dtos;

import dev.skyherobrine.service.models.Address;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class UserRegisterDTO {
    private String firstName;
    private String lastName;
    private Boolean sex;
    private String dob;
    private String phone;
    private String username;
    private String email;
    private String password;
    private String imageDetect;
    private AddressRegisterDTO address;

    public LocalDate getDobLocalDate() {
        String[] splitDob = dob.split("-");
        return LocalDate.of(Integer.parseInt(splitDob[2]), Integer.parseInt(splitDob[1]), Integer.parseInt(splitDob[0]));
    }

    public Address getAddress() {
        return new Address(
                address.getNumber(),
                address.getStreet(),
                address.getWard(),
                address.getDistrict(),
                address.getCity(),
                address.getCountry()
        );
    }
}
