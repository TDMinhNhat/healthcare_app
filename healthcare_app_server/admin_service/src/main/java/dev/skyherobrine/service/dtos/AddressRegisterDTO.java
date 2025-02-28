package dev.skyherobrine.service.dtos;

import dev.skyherobrine.service.models.mariadb.Address;
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

    public Address toObject() {
        return new Address(number, street, ward, district, city, country);
    }
}
