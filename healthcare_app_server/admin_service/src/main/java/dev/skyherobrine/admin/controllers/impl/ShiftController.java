package dev.skyherobrine.admin.controllers.impl;

import dev.skyherobrine.admin.controllers.IManagement;
import dev.skyherobrine.admin.dtos.ShiftDTO;
import dev.skyherobrine.admin.models.mariadb.Response;
import dev.skyherobrine.admin.models.mariadb.Shift;
import dev.skyherobrine.admin.repositories.mariadb.ShiftRepository;
import dev.skyherobrine.admin.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/api/v1/shift")
@Slf4j
public class ShiftController implements IManagement<ShiftDTO,Long> {

    private final ShiftRepository shiftRepository;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public ShiftController(ShiftRepository shiftRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.shiftRepository = shiftRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @GetMapping
    @Override
    public ResponseEntity<Response> getAll() {
        log.info("Shift: Call the api get all shifts");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all shifts",
                shiftRepository.findAll()
        ));
    }

    @GetMapping("/status")
    public ResponseEntity<Response> getAllByStatus(@RequestParam boolean status) {
        log.info("Shift: Call the api get all shifts by status");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all shifts by status",
                shiftRepository.findAllByStatus(status)
        ));
    }

    @Override
    public ResponseEntity<Response> getById(Long aLong) {
        return null;
    }

    @PostMapping
    @Override
    public ResponseEntity<Response> add(@RequestBody ShiftDTO shift) {
        try {
            log.info("Shift: Call the api add the shift");
            Shift target = shift.toObject();
            kafkaTemplate.send("insert_shift", ObjectParser.convertObjectToJson(target));
            Shift result = shiftRepository.save(target);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "The shift has been added",
                    result
            ));
        } catch (Exception e) {
            log.error("Shift: The api thrown an exception");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an exception",
                    e.getMessage()
            ));
        }
    }

    @Override
    public ResponseEntity<Response> update(Long aLong, ShiftDTO shift) {
        return null;
    }

    @DeleteMapping("/{id}")
    @Override
    public ResponseEntity<Response> delete(@PathVariable("id") Long id) {
        try {
            log.info("Shift: Call the api delete the shift");
            Shift shift = shiftRepository.findById(id).orElse(null);

            if(shift != null) {
                log.info("Shift: send the message to kafka");
                kafkaTemplate.send("delete_shift", ObjectParser.convertObjectToJson(id));

                shift.setStatus(false);
                Shift result = shiftRepository.save(shift);
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "The shift has been deleted",
                        result
                ));
            }
            return ResponseEntity.ok(new Response(
                    HttpStatus.BAD_REQUEST.value(),
                    "The shift wasn't found!",
                    null
            ));
        } catch (Exception e) {
            log.error("Shift: The api thrown an exception");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an exception",
                    e.getMessage()
            ));
        }
    }
}
