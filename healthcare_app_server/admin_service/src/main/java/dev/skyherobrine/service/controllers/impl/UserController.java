package dev.skyherobrine.service.controllers.impl;

import dev.skyherobrine.service.controllers.IManagement;
import dev.skyherobrine.service.models.mariadb.Response;
import dev.skyherobrine.service.models.mariadb.User;
import dev.skyherobrine.service.repositories.mariadb.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("admin/api/v1/user")
@Slf4j
public class UserController implements IManagement<User,Long> {

    private final UserRepository ur;

    public UserController(UserRepository ur) {
        this.ur = ur;
    }

    @GetMapping
    @Override
    public ResponseEntity<Response> getAll() {
        log.info("Call get all users");
        return ResponseEntity.ok(new Response(HttpStatus.OK.value(), "Get all users", ur.findAll()));
    }

    @Override
    public ResponseEntity<Response> getById(Long aLong) {
        return null;
    }

    @Override
    public ResponseEntity<Response> add(User user) {
        return null;
    }

    @Override
    public ResponseEntity<Response> update(Long aLong, User user) {
        return null;
    }

    @DeleteMapping("{id}")
    @Override
    public ResponseEntity<Response> delete(@PathVariable("id") Long aLong) {
        log.info("Call delete user");
        try {
            User user = ur.findById(aLong).orElse(null);
            if(user == null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.NOT_FOUND.value(),
                        "User not found",
                        null
                ));
            }
            user.setStatus(false);
            User result = ur.save(user);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Delete user",
                    result
            ));
        } catch (Exception e) {
            log.error("Server return an error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    e.getMessage(),
                    null
            ));
        }
    }

    @GetMapping("status/{status}")
    public ResponseEntity<Response> getUserByStatus(@PathVariable("status") String status) {
        log.info("Call get user by status");
        try {
            boolean getStatus = Boolean.parseBoolean(status);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get user by status",
                    ur.findByStatus(getStatus)
            ));
        } catch (Exception e) {
            log.error("Server return an error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    e.getMessage(),
                    null
            ));
        }
    }

    @GetMapping("authed_provider/{id}")
    public ResponseEntity<Response> getUserByAuthedProvider(@PathVariable("id") Long authenticateProviderId) {
        log.info("Call get user by authenticate provider");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get user by authenticate provider",
                ur.findByAuthedProvider_Id(authenticateProviderId)
        ));
    }

    @GetMapping("user_role/{id}")
    public ResponseEntity<Response> getUserByUserRole(@PathVariable("id") Long userRoleId) {
        log.info("Call get user by user role");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get user by user role",
                ur.findByRole_Id(userRoleId)
        ));
    }
}
