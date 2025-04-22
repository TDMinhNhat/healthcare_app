package dev.skyherobrine.appointment.controllers;

import dev.skyherobrine.appointment.models.Response;
import dev.skyherobrine.appointment.repositories.mariadb.PriceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointment/api/v1/price")
@Slf4j
public class PriceController {

    private final PriceRepository priceRepository;

    public PriceController(PriceRepository priceRepository) {
        this.priceRepository = priceRepository;
    }

    @GetMapping("/price_type")
    public ResponseEntity<Response> getCurrentPrice(@RequestParam("price_type") String priceType) {
        try {
            log.info("Price: Call the api get current price");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get current price successfully",
                    priceRepository.getCurrentPriceByPriceType(priceType).orElse(null)
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
