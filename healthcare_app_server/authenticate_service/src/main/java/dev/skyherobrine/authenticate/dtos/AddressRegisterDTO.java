package dev.skyherobrine.authenticate.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AddressRegisterDTO {
    private String number;
    private String street;
    private String ward;
    private String district;
    private String city;
    private String country;
}
