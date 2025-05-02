package dev.skyherobrine.admin.dtos;

import dev.skyherobrine.admin.models.mariadb.Shift;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Getter @Setter
@AllArgsConstructor
public class ShiftDTO {

    private int shift;
    private String start;
    private String end;

    public Shift toObject() {
        return new Shift(shift, LocalTime.parse(start, DateTimeFormatter.ofPattern("HH-mm")), LocalTime.parse(end, DateTimeFormatter.ofPattern("HH-mm")));
    }
}
