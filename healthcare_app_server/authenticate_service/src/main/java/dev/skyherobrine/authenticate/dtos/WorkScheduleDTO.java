package dev.skyherobrine.authenticate.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class WorkScheduleDTO {

    private String doctorId;
    private String timeStart;
    private String timeEnd;


}
