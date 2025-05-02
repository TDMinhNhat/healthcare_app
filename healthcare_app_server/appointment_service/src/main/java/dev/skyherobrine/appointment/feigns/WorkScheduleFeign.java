package dev.skyherobrine.appointment.feigns;

import dev.skyherobrine.appointment.models.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "workschedulefeign", url = "localhost:9000/authenticate/api/v1/work_schedule")
public interface WorkScheduleFeign {

    @GetMapping("/{id}")
    ResponseEntity<Response> getById(@PathVariable("id") Long id);

    @GetMapping("/id/doctor")
    ResponseEntity<Response> getWorkScheduleIdByDoctorId(@RequestParam String doctorId);

    @GetMapping("/{id}")
    ResponseEntity<Response> getWorkScheduleById(@PathVariable String id);

    @GetMapping("/between")
    ResponseEntity<Response> getWorkScheduleByBetweenDate(@RequestParam("start") String start, @RequestParam("end") String end);
}
