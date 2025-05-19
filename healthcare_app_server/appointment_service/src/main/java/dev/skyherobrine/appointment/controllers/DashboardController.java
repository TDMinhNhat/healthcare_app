package dev.skyherobrine.appointment.controllers;

import dev.skyherobrine.appointment.messages.consumers.responses.AdminDashboardResponseConsumer;
import dev.skyherobrine.appointment.models.Response;
import dev.skyherobrine.appointment.services.DashboardService;
import dev.skyherobrine.appointment.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointment/api/v1/dashboard")
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;
    private final KafkaTemplate<String,String> kafkaTemplate;
    private final AdminDashboardResponseConsumer adminDashboardResponseConsumer;

    public DashboardController(DashboardService dashboardService, KafkaTemplate<String, String> kafkaTemplate, AdminDashboardResponseConsumer adminDashboardResponseConsumer) {
        this.dashboardService = dashboardService;
        this.kafkaTemplate = kafkaTemplate;
        this.adminDashboardResponseConsumer = adminDashboardResponseConsumer;
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
            kafkaTemplate.send("request_get_admin_dashboard", "").get();
            kafkaTemplate.flush();
            Thread.sleep(1000);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get admin dashboard",
                    adminDashboardResponseConsumer.getStorageData()
            ));
        } catch (Exception e) {
            log.error("Dashboard Controller: The api thrown an error");
            log.error("Dashboard Controller: {}", e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Get admin dashboard failed",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/admin/doctor/quarter")
    public ResponseEntity<Response> getListDoctorByQuarter(@RequestParam String quarter) {
        try {
            log.info("Dashboard Controller: Call the api get list doctor by quarter");
            kafkaTemplate.send("request_get_list_doctor_by_quarter", ObjectParser.convertObjectToJson(quarter));
            Thread.sleep(1000);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get list doctor by quarter",
                    adminDashboardResponseConsumer.getStorageData()
            ));
        } catch (Exception e) {
            log.error("Dashboard Controller: The api thrown an error");
            log.error("Dashboard Controller: {}", e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Get list doctor by quarter failed",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/admin/doctor/month")
    public ResponseEntity<Response> getListDoctorByMonth(@RequestParam String month) {
        try {
            log.info("Dashboard Controller: Call the api get list doctor by month");
            kafkaTemplate.send("request_get_list_doctor_by_month", ObjectParser.convertObjectToJson(month));
            Thread.sleep(1000);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get list doctor by month",
                    adminDashboardResponseConsumer.getStorageData()
            ));
        } catch (Exception e) {
            log.error("Dashboard Controller: The api thrown an error");
            log.error("Dashboard Controller: {}", e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Get list doctor by month failed",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/admin/doctor/year")
    public ResponseEntity<Response> getListDoctorByYear(@RequestParam String year) {
        try {
            log.info("Dashboard Controller: Call the api get list doctor by year");
            kafkaTemplate.send("request_get_list_doctor_by_year", ObjectParser.convertObjectToJson(year));
            Thread.sleep(1000);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get list doctor by year",
                    adminDashboardResponseConsumer.getStorageData()
            ));
        } catch (Exception e) {
            log.error("Dashboard Controller: The api thrown an error");
            log.error("Dashboard Controller: {}", e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Get list doctor by year failed",
                    e.getMessage()
            ));
        }
    }
}
