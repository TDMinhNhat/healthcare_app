package dev.skyherobrine.appointment.feigns;

import dev.skyherobrine.appointment.models.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import static dev.skyherobrine.appointment.feigns.UserFeign.domainHostName;

@FeignClient(name = "userfeign", url = domainHostName + ":9000/authenticate/api/v1/user")
public interface UserFeign {

    @Value("${domain-host-name}")
    String domainHostName = "";

    @GetMapping("/patient")
    ResponseEntity<Response> getPatientByUserId(@RequestParam String userId);

    @GetMapping("/doctor")
    ResponseEntity<Response> getDoctorByUserId(@RequestParam String userId);
}
