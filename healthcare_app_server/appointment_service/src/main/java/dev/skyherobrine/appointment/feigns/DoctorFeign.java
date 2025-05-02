package dev.skyherobrine.appointment.feigns;

import dev.skyherobrine.appointment.models.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "doctorfeign", url = "localhost:10000/admin/api/v1/doctors")
public interface DoctorFeign {

    @RequestMapping(method = RequestMethod.POST, value = "/doctor_not_in_list")
    ResponseEntity<Response> getAllDoctor(@RequestBody List<String> listDoctorsId);

    @RequestMapping(method = RequestMethod.GET, value = "/userId")
    ResponseEntity<Response> getDoctorInformation(@RequestParam("userId") String doctorId);
}
