package dev.skyherobrine.authenticate.feigns;

import dev.skyherobrine.authenticate.models.mariadb.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "bookAppointmentFeign", url = "api_gateway_service:8081/appointment/api/v1/booking")
public interface BookAppointmentFeign {

    @GetMapping("/work_schedule")
    ResponseEntity<Response> getAppointmentByWorkSchedule(@RequestParam String workSchedule);

    @GetMapping("/detail")
    ResponseEntity<Response> getAppointmentDetailByWorkSchedule(@RequestParam String workSchedule);
}
