package dev.skyherobrine.service;

import dev.skyherobrine.service.repositories.mariadb.DoctorRepository;
import dev.skyherobrine.service.services.WorkScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AuthenticateServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthenticateServiceApplication.class, args);
    }

    @Autowired
    public DoctorRepository doctorRepository;
    @Autowired
    public WorkScheduleService workScheduleService;

}
