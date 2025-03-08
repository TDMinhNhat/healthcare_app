package dev.skyherobrine.appointment.services;

import dev.skyherobrine.appointment.enums.AppointmentStatus;
import dev.skyherobrine.appointment.feigns.UserFeign;
import dev.skyherobrine.appointment.feigns.WorkScheduleFeign;
import dev.skyherobrine.appointment.models.mongodb.Appointment;
import dev.skyherobrine.appointment.repositories.mongodb.AppointmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserFeign userFeign;
    private final WorkScheduleFeign workScheduleFeign;

    public AppointmentService(AppointmentRepository appointmentRepository, UserFeign userFeign, WorkScheduleFeign workScheduleFeign) {
        this.appointmentRepository = appointmentRepository;
        this.userFeign = userFeign;
        this.workScheduleFeign = workScheduleFeign;
    }

    public List<Map<String,Object>> getAppointmentByDoctor(String doctorId) {
        log.info("Appointment Service: Call the api to get doctor's appointments");
        List<Long> workSchedules = (List<Long>) workScheduleFeign.getWorkScheduleIdByDoctorId(doctorId).getBody().getData();
        List<Appointment> appointments = appointmentRepository.findAll().stream().filter(appointment -> workSchedules.contains(Integer.parseInt(appointment.getWorkSchedule().toString()))).toList();

        List<Map<String,Object>> result = new ArrayList<>();
        appointments.forEach(appointment -> {
            Map<String,Object> map = new HashMap<>() {
                {
                    put("appointment", appointment);
                    put("patient", userFeign.getPatientByUserId(appointment.getPatient()).getBody().getData());
                }
            };

            result.add(map);
        });

        return result;
    }

    public List<Map<String,Object>> getAppointmentByDoctorAndStatus(String doctorId, AppointmentStatus status) {
        log.info("Appointment Service: Call the api to get doctor's appointments by status");
        List<Long> workSchedules = (List<Long>) workScheduleFeign.getWorkScheduleIdByDoctorId(doctorId).getBody().getData();
        List<Appointment> appointments = appointmentRepository.findByStatus(status).stream().filter(appointment -> workSchedules.contains(Integer.parseInt(appointment.getWorkSchedule().toString()))).toList();

        List<Map<String,Object>> result = new ArrayList<>();
        appointments.forEach(appointment -> {
            Map<String,Object> map = new HashMap<>() {
                {
                    put("appointment", appointment);
                    put("patient", userFeign.getPatientByUserId(appointment.getPatient()).getBody().getData());
                }
            };

            result.add(map);
        });

        return result;
    }
}
