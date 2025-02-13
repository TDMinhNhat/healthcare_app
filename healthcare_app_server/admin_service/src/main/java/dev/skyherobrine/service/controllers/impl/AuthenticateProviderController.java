package dev.skyherobrine.service.controllers.impl;

import dev.skyherobrine.service.controllers.IManagement;
import dev.skyherobrine.service.models.mariadb.AuthenticateProvider;
import dev.skyherobrine.service.models.mariadb.Response;
import dev.skyherobrine.service.repositories.mariadb.AuthenticateProviderRepository;
import dev.skyherobrine.service.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("admin/api/v1/authenticate_provider")
@Slf4j
public class AuthenticateProviderController implements IManagement<String, Long> {

    private AuthenticateProviderRepository apr;
    private KafkaTemplate template;

    public AuthenticateProviderController(AuthenticateProviderRepository apr, KafkaTemplate template) {
        this.apr = apr;
        this.template = template;
    }

    @GetMapping
    @Override
    public ResponseEntity<Response> getAll() {
        log.info("Call get all authenticate provider");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all authenticate providers",
                apr.findAll()
        ));
    }

    @GetMapping("{id}")
    @Override
    public ResponseEntity<Response> getById(@PathVariable("id") Long aLong) {
        try {
            log.info("Call get authenticate provider by id");
            AuthenticateProvider result = apr.findById(aLong).orElse(null);
            if (result == null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.NOT_FOUND.value(),
                        "The authenticate provider is not found",
                        null
                ));
            }
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get authenticate provider by id",
                    result
            ));
        } catch (Exception e) {
            log.error("Server return an error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The server return an error, please try again later.",
                    e.getMessage()
            ));
        }
    }

    @PostMapping
    @Override
    public ResponseEntity<Response> add(@RequestParam("methodName") String methodName) {
        try {
            log.info("Call add authenticate provider");
            AuthenticateProvider ap = new AuthenticateProvider(methodName);
            AuthenticateProvider result = apr.save(ap);
            template.send("insert_authenticate_provider", ObjectParser.convertObjectToJson(result));
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "The authenticate provider is added",
                    result
            ));
        } catch (Exception e) {
            log.error("Server return an error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The server return an error, please try again later.",
                    e.getMessage()
            ));
        }
    }

    @PutMapping("{id}")
    @Override
    public ResponseEntity<Response> update(
            @PathVariable("id") Long aLong,
            @RequestParam("methodName") String methodName
    ) {
        log.info("Call update authenticate provider");
        try {
            AuthenticateProvider ap = apr.findById(aLong).orElse(null);
            if (ap == null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.NOT_FOUND.value(),
                        "The authenticate provider is not found",
                        null
                ));
            }
            ap.setAuthenName(methodName);
            AuthenticateProvider result = apr.save(ap);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "The authenticate provider is updated",
                    result
            ));
        } catch (Exception e) {
            log.error("Server return an error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The server return an error, please try again later.",
                    e.getMessage()
            ));
        }
    }

    @DeleteMapping("{id}")
    @Override
    public ResponseEntity<Response> delete(@PathVariable("id") Long aLong) {
        try {
            log.info("Call delete authenticate provider");
            AuthenticateProvider ap = apr.findById(aLong).orElse(null);
            if (ap == null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.NOT_FOUND.value(),
                        "The authenticate provider is not found",
                        null
                ));
            }
            ap.setStatus(false);
            AuthenticateProvider result = apr.save(ap);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "The authenticate provider updated status",
                    result
            ));
        } catch (Exception e) {
            log.error("Server return an error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The server return an error, please try again later.",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("status/{status}")
    public ResponseEntity<Response> getMethodAuthedByStatus(@PathVariable("status") String status) {
        log.info("Call get authenticate provider by status");
        try {
            boolean getStatus = Boolean.parseBoolean(status);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get authenticate provider by status",
                    apr.getAuthenticateProviderByStatus(getStatus)
            ));
        } catch (Exception e) {
            log.error("Server return an error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The server return an error, please try again later.",
                    e.getMessage()
            ));
        }
    }
}
