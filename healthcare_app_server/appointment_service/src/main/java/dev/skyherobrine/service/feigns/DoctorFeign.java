package dev.skyherobrine.service.feigns;

import dev.skyherobrine.service.models.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "doctorfeign", url = "localhost:10000/admin/api/v1/doctors")
public interface DoctorFeign {

    @RequestMapping(method = RequestMethod.POST, value = "/doctor_not_in_list")
    ResponseEntity<Response> getAllDoctor(@RequestBody List<String> listDoctorsId);
}
