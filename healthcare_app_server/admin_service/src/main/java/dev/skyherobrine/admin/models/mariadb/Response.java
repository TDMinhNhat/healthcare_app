package dev.skyherobrine.admin.models.mariadb;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Response {
    private Integer code;
    private String message;
    private Object data;
}
