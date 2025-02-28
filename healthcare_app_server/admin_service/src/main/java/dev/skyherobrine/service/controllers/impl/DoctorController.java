package dev.skyherobrine.service.controllers.impl;

import dev.skyherobrine.service.controllers.IManagement;
import dev.skyherobrine.service.dtos.DoctorDTO;
import dev.skyherobrine.service.models.mariadb.Doctor;
import dev.skyherobrine.service.models.mariadb.Response;
import dev.skyherobrine.service.services.DoctorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/api/v1/doctors")
@Slf4j
public class DoctorController implements IManagement<DoctorDTO, Long> {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @Override
    public ResponseEntity<Response> getAll() {
        return null;
    }

    @Override
    public ResponseEntity<Response> getById(Long aLong) {
        return null;
    }

    @PostMapping
    @Override
    public ResponseEntity<Response> add(@RequestBody DoctorDTO doctorDTO) {
        try {
            log.info("Doctor: Call the api insert doctor");
            Doctor target = doctorService.addDoctor(doctorDTO);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Insert doctor successfully",
                    target
            ));
        } catch (Exception e) {
            log.error("Doctor: insert doctor failed");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Insert doctor failed",
                    null
            ));
        }
    }

    @Override
    public ResponseEntity<Response> update(Long aLong, DoctorDTO doctorDTO) {
        return null;
    }

    @Override
    public ResponseEntity<Response> delete(Long aLong) {
        return null;
    }
}
