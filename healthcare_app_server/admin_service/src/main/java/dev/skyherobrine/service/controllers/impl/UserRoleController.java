package dev.skyherobrine.service.controllers.impl;

import dev.skyherobrine.service.controllers.IManagement;
import dev.skyherobrine.service.models.mariadb.Response;
import dev.skyherobrine.service.models.mariadb.UserRole;
import dev.skyherobrine.service.repositories.mariadb.UserRoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("admin/api/v1/user_role")
@Slf4j
public class UserRoleController implements IManagement<String,Long> {

    private UserRoleRepository urr;

    public UserRoleController(UserRoleRepository urr) {
        this.urr = urr;
    }

    @GetMapping
    @Override
    public ResponseEntity<Response> getAll() {
        log.info("Call get all user role");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all user role success",
                urr.findAll()
        ));
    }

    @GetMapping("{id}")
    @Override
    public ResponseEntity<Response> getById(@PathVariable("id") Long aLong) {
        log.info("Call get user role by id");
        try {
            UserRole userRole = urr.findById(aLong).get();
            if(userRole == null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.NOT_FOUND.value(),
                        "User role not found",
                        null
                ));
            }
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get user role by id success",
                    userRole
            ));
        } catch (Exception e) {
            log.error("Server return an error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Server return an error",
                    e
            ));
        }
    }

    @PostMapping
    @Override
    public ResponseEntity<Response> add(@RequestParam("roleName") String s) {
        log.info("Call add user role");
        try {
            UserRole ur = new UserRole(s);
            UserRole target = urr.save(ur);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Add user role success",
                    target
            ));
        } catch (Exception e) {
            log.error("Server return an error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Server return an error",
                    e
            ));
        }
    }

    @PutMapping("{id}")
    @Override
    public ResponseEntity<Response> update(@PathVariable("id") Long aLong, @RequestBody String roleName) {
        log.info("Call update user role");
        try {
            UserRole ur = urr.findById(aLong).get();
            if(ur == null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.NOT_FOUND.value(),
                        "User role not found",
                        null
                ));
            }
            ur.setRoleName(roleName);
            UserRole result = urr.save(ur);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Update user role success",
                    result
            ));
        } catch (Exception e) {
            log.error("Server return an error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Server return an error",
                    e
            ));
        }
    }

    @DeleteMapping("{id}")
    @Override
    public ResponseEntity<Response> delete(@PathVariable("id") Long aLong) {
        log.info("Call delete user role");
        try {
            UserRole ur = urr.findById(aLong).get();
            if(ur == null) {
                return ResponseEntity.ok(new Response(
                        HttpStatus.NOT_FOUND.value(),
                        "User role not found",
                        null
                ));
            }
            ur.setStatus(false);
            UserRole result = urr.save(ur);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Delete user role success",
                    result
            ));
        } catch (Exception e) {
            log.error("Server return an error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Server return an error",
                    e
            ));
        }
    }

    @GetMapping("status/{status}")
    public ResponseEntity<Response> getUserRoleByStatus(@PathVariable("status") String status) {
        log.info("Call get user role by status");
        try {
            boolean s = Boolean.parseBoolean(status);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get user role by status success",
                    urr.findUserRolesByStatus(s)
            ));
        } catch (Exception e) {
            log.error("Server return an error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Server return an error",
                    e
            ));
        }
    }
}
