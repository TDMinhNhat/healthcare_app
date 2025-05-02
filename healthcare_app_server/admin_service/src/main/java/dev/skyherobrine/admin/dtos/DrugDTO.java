package dev.skyherobrine.admin.dtos;

import dev.skyherobrine.admin.models.mariadb.Drug;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class DrugDTO {
    private String drugName;
    private String drugType;
    private String unit;

    public Drug toObject() {
        return new Drug(drugName, drugType, unit);
    }
}
