package dev.skyherobrine.service.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AddressRegisterDTO {
    private Integer number;
    private String street;
    private String ward;
    private String district;
    private String city;
    private String country;
}
