package dev.skyherobrine.authenticate.services;

import dev.skyherobrine.authenticate.dtos.WorkScheduleDTO;
import dev.skyherobrine.authenticate.enums.TypeDay;
import dev.skyherobrine.authenticate.messages.producers.WorkScheduleProducer;
import dev.skyherobrine.authenticate.models.mariadb.Doctor;
import dev.skyherobrine.authenticate.models.mariadb.Shift;
import dev.skyherobrine.authenticate.models.mongodb.WorkSchedule;
import dev.skyherobrine.authenticate.repositories.mariadb.DoctorRepository;
import dev.skyherobrine.authenticate.repositories.mariadb.ShiftRepository;
import dev.skyherobrine.authenticate.repositories.mongodb.WorkScheduleRepository;
import dev.skyherobrine.authenticate.utils.ObjectParser;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class WorkScheduleService {

    private final ShiftRepository shiftRepository;
    private final WorkScheduleRepository workScheduleRepository;
    private final DoctorRepository doctorRepository;
    private final KafkaTemplate<String,String> kafkaTemplate;

    public WorkScheduleService(ShiftRepository shiftRepository, WorkScheduleRepository workScheduleRepository, DoctorRepository doctorRepository, KafkaTemplate<String, String> kafkaTemplate, WorkScheduleProducer workScheduleProducer) {
        this.shiftRepository = shiftRepository;
        this.workScheduleRepository = workScheduleRepository;
        this.doctorRepository = doctorRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public synchronized WorkSchedule addWorkSchedule(WorkScheduleDTO workScheduleDTO) throws Exception {
        log.info("Work Schedule Service: Call the service add work schedule");
        Doctor doctor = doctorRepository.findDoctorByUserId(workScheduleDTO.getDoctorId()).orElseThrow(() -> new EntityNotFoundException("The doctor wasn't found!"));
        Shift shift = shiftRepository.findByShiftAndStatusTrue(workScheduleDTO.getShift()).orElseThrow(() -> new EntityNotFoundException("The shift wasn't found!"));

        Long id = getMaxId();
        log.info("Work Schedule Service: The max id is {}", id);

        WorkSchedule workSchedule = new WorkSchedule(
                id,
                doctor,
                shift,
                workScheduleDTO.getMaxSlots(),
                workScheduleDTO.getDateAppointment()
        );
        log.info("Work Schedule Service: send the add work schedule to kafka");
        kafkaTemplate.send("insert_work_schedule", ObjectParser.convertObjectToJson(workSchedule));

        WorkSchedule result = workScheduleRepository.save(workSchedule);
        log.info("Work Schedule Service: add work schedule successfully!");
        return result;
    }

    public Long getMaxId() {
        WorkSchedule workSchedule = new WorkSchedule();
        workSchedule.setId(0L);
        return workScheduleRepository.findTopByOrderByIdDesc().orElse(workSchedule).getId() + 1;
    }
}
