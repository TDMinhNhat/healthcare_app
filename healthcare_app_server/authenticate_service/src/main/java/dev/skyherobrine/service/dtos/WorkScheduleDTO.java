package dev.skyherobrine.service.dtos;

import dev.skyherobrine.service.enums.TypeDay;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class WorkScheduleDTO {

    private String doctorId;
    private TypeDay typeDay;
    private String timeStart;
    private String timeEnd;

}
