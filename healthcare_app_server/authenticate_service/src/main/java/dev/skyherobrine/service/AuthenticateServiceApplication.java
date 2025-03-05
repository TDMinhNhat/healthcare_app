package dev.skyherobrine.service;

import dev.skyherobrine.service.dtos.WorkScheduleDTO;
import dev.skyherobrine.service.models.mariadb.Doctor;
import dev.skyherobrine.service.models.mongodb.WorkSchedule;
import dev.skyherobrine.service.repositories.mariadb.DoctorRepository;
import dev.skyherobrine.service.repositories.mongodb.WorkScheduleRepository;
import dev.skyherobrine.service.services.WorkScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@SpringBootApplication
@EnableDiscoveryClient
public class AuthenticateServiceApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(AuthenticateServiceApplication.class, args);
    }

    @Autowired
    public DoctorRepository doctorRepository;
    @Autowired
    public WorkScheduleService workScheduleService;

    @Override
    public void run(String... args) throws Exception {
        List<Doctor> doctors = doctorRepository.findAll();

        for(Doctor doctor : doctors) {
            LocalDate date = LocalDate.of(2025, 3, 3);
            while(date.getDayOfMonth() <= 8) {
                LocalDateTime start = LocalDateTime.of(date, LocalTime.of(7, 0));
                LocalDateTime end = start.plusMinutes(30);

                while(start.getHour() <= 17) {
                    WorkScheduleDTO workScheduleDTO = new WorkScheduleDTO(
                            doctor.getUserId(),
                            start.format(DateTimeFormatter.ofPattern("dd-MM-yyyy-HH-mm-ss")),
                            end.format(DateTimeFormatter.ofPattern("dd-MM-yyyy-HH-mm-ss"))
                    );
                    workScheduleService.addWorkSchedule(workScheduleDTO);

                    start = end;
                    end = start.plusMinutes(30);

                    if(start.getHour() == 11) {
                        start.plusHours(2);
                        end = start.plusMinutes(30);
                    }
                }

                date.plusDays(1L);
            }
        }
    }
}
