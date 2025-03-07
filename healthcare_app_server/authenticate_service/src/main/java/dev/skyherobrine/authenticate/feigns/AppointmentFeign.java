package dev.skyherobrine.authenticate.feigns;

import dev.skyherobrine.authenticate.models.mariadb.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "appointmentfeign", url = "localhost:11000/appointment/api/v1/booking")
public interface AppointmentFeign {

    @GetMapping("/work_schedule")
    ResponseEntity<Response> getAppointmentByWorkSchedule(@RequestParam String workSchedule);
}
