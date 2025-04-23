package dev.skyherobrine.appointment.controllers;

import dev.skyherobrine.appointment.models.Response;
import dev.skyherobrine.appointment.services.DashboardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointment/api/v1/dashboard")
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/patient")
    public ResponseEntity<Response> getPatientDashboard(@RequestParam String patientId) {
        try {
            log.info("Dashboard Controller: Call the api get patient dashboard");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get patient dashboard",
                    dashboardService.getPatientDashboard(patientId)
            ));
        } catch (Exception e) {
            log.error("Dashboard Controller: The api thrown an error");
            log.error("Dashboard Controller: {}", e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Get patient dashboard failed",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/doctor")
    public ResponseEntity<Response> getDoctorDashboard(@RequestParam String doctorId) {
        try {
            log.info("Dashboard Controller: Call the api get doctor dashboard");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get doctor dashboard",
                    dashboardService.getDoctorDashboard(doctorId)
            ));
        } catch (Exception e) {
            log.error("Dashboard Controller: The api thrown an error");
            log.error("Dashboard Controller: {}", e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Get patient dashboard failed",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/admin")
    public ResponseEntity<Response> getAdminDashboard() {
        try {
            log.info("Dashboard Controller: Call the api get admin dashboard");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get admin dashboard",
                    dashboardService.getAdminDashboard()
            ));
        } catch (Exception e) {
            log.error("Dashboard Controller: The api thrown an error");
            log.error("Dashboard Controller: {}", e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Get patient dashboard failed",
                    e.getMessage()
            ));
        }
    }
}
