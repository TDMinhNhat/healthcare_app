package dev.skyherobrine.authenticate.dtos;

import dev.skyherobrine.authenticate.enums.TypeDay;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class WorkScheduleDTO {

    private String doctorId;
    private TypeDay typeDay;
    private int shift;
    private int maxSlots;
}
