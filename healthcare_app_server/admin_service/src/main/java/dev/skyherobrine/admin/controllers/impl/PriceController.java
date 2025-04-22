package dev.skyherobrine.admin.controllers.impl;

import dev.skyherobrine.admin.controllers.IManagement;
import dev.skyherobrine.admin.dtos.PriceDTO;
import dev.skyherobrine.admin.models.mariadb.Price;
import dev.skyherobrine.admin.models.mariadb.Response;
import dev.skyherobrine.admin.repositories.mariadb.PriceRepository;
import dev.skyherobrine.admin.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/admin/api/v1/price")
@Slf4j
public class PriceController implements IManagement<PriceDTO,Long> {

    private final PriceRepository priceRepository;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public PriceController(PriceRepository priceRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.priceRepository = priceRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @GetMapping
    @Override
    public ResponseEntity<Response> getAll() {
        try {
            log.info("Price: Call the api get all prices");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get all prices",
                    priceRepository.findAll()
            ));
        } catch (Exception e) {
            log.error("Price: the api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }

    @Override
    public ResponseEntity<Response> getById(Long aLong) {
        return null;
    }

    @PostMapping
    @Override
    public ResponseEntity<Response> add(@RequestBody PriceDTO price) {
        try {
            log.info("Price: Call the api add the price");
            kafkaTemplate.send("insert_price", ObjectParser.convertObjectToJson(price));
            Price result = priceRepository.save(price.toObject());
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Price created successfully",
                    result
            ));
        } catch (Exception e) {
            log.error("Price: the api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    @Override
    public ResponseEntity<Response> update(@PathVariable("id") Long id, @RequestBody PriceDTO price) {
        try {
            log.info("Price: Call the api update the price");
            Price target = priceRepository.findById(id).orElse(null);
            if(target != null) {
                kafkaTemplate.send("update_price", ObjectParser.convertObjectToJson(new HashMap<>(){{
                    put("id", id);
                    put("price", price.getPrice());
                    put("priceType", price.getPriceType());
                }}));
                target.setPrice(price.getPrice());
                target.setPriceType(price.getPriceType());
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Price updated successfully",
                        priceRepository.save(target)
                ));
            }
            log.warn("Price: the price wasn't found! Create a new price");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Price not found but create a new price",
                    priceRepository.save(new Price(price.getPrice(), price.getPriceType()))
            ));
        } catch (Exception e) {
            log.error("Price: the api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    @Override
    public ResponseEntity<Response> delete(@PathVariable("id") Long id) {
        try {
            log.info("Price: Call the api delete the price");
            Price price = priceRepository.findById(id).orElse(null);
            if(price != null) {
                kafkaTemplate.send("delete_price", ObjectParser.convertObjectToJson(id));
                price.setStatus(false);
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Price deleted successfully",
                        priceRepository.save(price)
                ));
            }
            log.warn("Price: the price wasn't found!");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Price not found",
                    null
            ));
        } catch (Exception e) {
            log.error("Price: the api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }
}
