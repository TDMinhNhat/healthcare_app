package dev.skyherobrine.authenticate;

import dev.skyherobrine.authenticate.repositories.mariadb.DoctorRepository;
import dev.skyherobrine.authenticate.services.WorkScheduleService;
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
