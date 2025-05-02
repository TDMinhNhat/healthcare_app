package dev.skyherobrine.admin.dtos;

import dev.skyherobrine.admin.models.mariadb.Price;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class PriceDTO {
    private Double price;
    private String priceType;

    public Price toObject() {
        return new Price(price, priceType);
    }
}
