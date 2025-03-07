package dev.skyherobrine.appointment.feigns;

import dev.skyherobrine.appointment.models.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "workschedulefeign", url = "localhost:10000/admin/api/v1/work_schedule")
public interface WorkScheduleFeign {

    @GetMapping("/{id}")
    ResponseEntity<Response> getById(@PathVariable("id") Long id);

    @GetMapping("/id/doctor")
    ResponseEntity<Response> getWorkScheduleIdByDoctorId(@RequestParam String doctorId);
}
