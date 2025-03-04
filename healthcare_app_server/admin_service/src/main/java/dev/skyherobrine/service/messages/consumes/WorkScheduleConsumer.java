package dev.skyherobrine.service.messages.consumes;

import dev.skyherobrine.service.models.mariadb.WorkSchedule;
import dev.skyherobrine.service.repositories.mariadb.DoctorRepository;
import dev.skyherobrine.service.repositories.mariadb.WorkScheduleRepository;
import dev.skyherobrine.service.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class WorkScheduleConsumer {

    private final WorkScheduleRepository workScheduleRepository;
    private final DoctorRepository doctorRepository;

    public WorkScheduleConsumer(WorkScheduleRepository workScheduleRepository, DoctorRepository doctorRepository) {
        this.workScheduleRepository = workScheduleRepository;
        this.doctorRepository = doctorRepository;
    }

    @KafkaListener(topics = "insert_work_schedule", groupId = "group_id")
    public void insertWorkSchedule(String message) {
        try {
            log.info("Work Schedule Consumer: listen the message insert work schedule");
            WorkSchedule workSchedule = ObjectParser.convertJsonToObject(message, WorkSchedule.class);
            workScheduleRepository.save(workSchedule);
            log.info("Work Schedule Consumer: insert the work schedule successfully");
        } catch (Exception e) {
            log.error("Work Schedule Consumer: the consumer thrown an exception");
            log.error(e.getMessage());
        }
    }
}
