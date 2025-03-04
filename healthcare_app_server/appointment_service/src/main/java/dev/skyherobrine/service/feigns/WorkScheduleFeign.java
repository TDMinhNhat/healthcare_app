package dev.skyherobrine.service.feigns;

import dev.skyherobrine.service.models.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "workschedulefeign", url = "localhost:10000/admin/api/v1/work_schedule")
public interface WorkScheduleFeign {

    @GetMapping("/{id}")
    ResponseEntity<Response> getById(@PathVariable("id") Long id);
}
