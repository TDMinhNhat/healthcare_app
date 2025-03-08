package dev.skyherobrine.appointment.feigns;

import dev.skyherobrine.appointment.models.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "userfeign", url = "localhost:9000/authenticate/api/v1/user")
public interface UserFeign {

    @GetMapping("/patient")
    ResponseEntity<Response> getPatientByUserId(@RequestParam String userId);

    @GetMapping("/doctor")
    ResponseEntity<Response> getDoctorByUserId(@RequestParam String userId);
}
