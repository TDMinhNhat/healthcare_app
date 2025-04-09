package dev.skyherobrine.appointment.services;

import dev.skyherobrine.appointment.enums.AppointmentStatus;
import dev.skyherobrine.appointment.feigns.WorkScheduleFeign;
import dev.skyherobrine.appointment.models.mongodb.BookAppointment;
import dev.skyherobrine.appointment.repositories.mongodb.BookAppointmentRepository;
import dev.skyherobrine.appointment.repositories.mongodb.MedicalRecordDrugRepository;
import dev.skyherobrine.appointment.repositories.mongodb.MedicalRecordRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class DashboardService {

    private final BookAppointmentRepository bookAppointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicalRecordDrugRepository medicalRecordDrugRepository;
    private final WorkScheduleFeign workScheduleFeign;

    public DashboardService(BookAppointmentRepository bookAppointmentRepository, MedicalRecordRepository medicalRecordRepository, MedicalRecordDrugRepository medicalRecordDrugRepository, WorkScheduleFeign workScheduleFeign) {
        this.bookAppointmentRepository = bookAppointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.medicalRecordDrugRepository = medicalRecordDrugRepository;
        this.workScheduleFeign = workScheduleFeign;
    }

    public Map<String,Object> getPatientDashboard(String patientId) {
        Map<String,Object> result = new HashMap<>();
        List<BookAppointment> bookAppointments = bookAppointmentRepository.findByPatientId(patientId);

        Map<String,Object> appointmentStats = new HashMap<>();
        appointmentStats.put("total", bookAppointments.size());
        appointmentStats.put("complete", bookAppointments.stream().filter(appointment -> appointment.getStatus() == AppointmentStatus.DONE).toList().size());
        appointmentStats.put("upcoming", bookAppointments.stream().filter(appointment -> appointment.getStatus() == AppointmentStatus.WAITING).toList().size());
        appointmentStats.put("cancelled", bookAppointments.stream().filter(appointment -> appointment.getStatus() == AppointmentStatus.CANCELLED).toList().size());
        result.put("appointmentStats", appointmentStats);



        return result;
    }

    public Map<String,Object> getDoctorDashboard(String doctorId) {
        Map<String,Object> result = new HashMap<>();

        return result;
    }

    public Map<String,Object> getAdminDashboard(String adminId) {
        Map<String,Object> result = new HashMap<>();

        return result;
    }
}
