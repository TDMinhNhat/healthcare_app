package dev.skyherobrine.appointment.services;

import com.fasterxml.jackson.databind.JsonNode;
import dev.skyherobrine.appointment.enums.AppointmentStatus;
import dev.skyherobrine.appointment.feigns.WorkScheduleFeign;
import dev.skyherobrine.appointment.messages.consumers.responses.WorkScheduleResponseConsumer;
import dev.skyherobrine.appointment.models.mongodb.BookAppointment;
import dev.skyherobrine.appointment.repositories.mongodb.BookAppointmentRepository;
import dev.skyherobrine.appointment.repositories.mongodb.MedicalRecordDrugRepository;
import dev.skyherobrine.appointment.repositories.mongodb.MedicalRecordRepository;
import dev.skyherobrine.appointment.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjuster;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class DashboardService {

    private final BookAppointmentRepository bookAppointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicalRecordDrugRepository medicalRecordDrugRepository;
    private final BookingService bookingService;
    private final WorkScheduleFeign workScheduleFeign;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final WorkScheduleResponseConsumer workScheduleResponseConsumer;

    public DashboardService(BookAppointmentRepository bookAppointmentRepository, MedicalRecordRepository medicalRecordRepository, MedicalRecordDrugRepository medicalRecordDrugRepository, BookingService bookingService, WorkScheduleFeign workScheduleFeign, KafkaTemplate<String, String> kafkaTemplate, WorkScheduleResponseConsumer workScheduleResponseConsumer) {
        this.bookAppointmentRepository = bookAppointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.medicalRecordDrugRepository = medicalRecordDrugRepository;
        this.bookingService = bookingService;
        this.workScheduleFeign = workScheduleFeign;
        this.kafkaTemplate = kafkaTemplate;
        this.workScheduleResponseConsumer = workScheduleResponseConsumer;
    }

    public Map<String,Object> getPatientDashboard(String patientId) throws Exception {
        Map<String,Object> result = new HashMap<>();
        List<BookAppointment> bookAppointments = bookAppointmentRepository.findByPatientId(patientId);

        //Get appointment stats
        Map<String,Object> appointmentStats = new HashMap<>();
        appointmentStats.put("total", bookAppointments.size());
        appointmentStats.put("complete", bookAppointments.stream().filter(appointment -> appointment.getStatus() == AppointmentStatus.DONE).toList().size());
        appointmentStats.put("upcoming", bookAppointments.stream().filter(appointment -> appointment.getStatus() == AppointmentStatus.WAITING).toList().size());
        appointmentStats.put("cancelled", bookAppointments.stream().filter(appointment -> appointment.getStatus() == AppointmentStatus.CANCELLED).toList().size());
        result.put("appointmentStats", appointmentStats);

        //Visualize appointment from the week or year
        Map<String,Object> charts = new HashMap<>();

        //// Monthly
        Map<String,Object> monthly = new HashMap<>();
        kafkaTemplate.send("request_visualize_appointment_by_monthly", ObjectParser.convertObjectToJson(bookAppointments.stream().map(BookAppointment::getWorkSchedule).toList()));
        JsonNode node = workScheduleResponseConsumer.getStorageData();
        if(node != null) {
            monthly.put("jan", node.get("1").asInt());
            monthly.put("feb", node.get("2").asInt());
            monthly.put("mar", node.get("3").asInt());
            monthly.put("apr", node.get("4").asInt());
            monthly.put("may", node.get("5").asInt());
            monthly.put("jun", node.get("6").asInt());
            monthly.put("jul", node.get("7").asInt());
            monthly.put("aug", node.get("8").asInt());
            monthly.put("sep", node.get("9").asInt());
            monthly.put("oct", node.get("10").asInt());
            monthly.put("nov", node.get("11").asInt());
            monthly.put("dec", node.get("12").asInt());
        }
        charts.put("monthly", monthly);

        //// Yearly
        Map<String,Object> yearly = new HashMap<>();
        kafkaTemplate.send("request_visualize_appointment_by_yearly", ObjectParser.convertObjectToJson(bookAppointments.stream().map(BookAppointment::getWorkSchedule).toList()));
        node = workScheduleResponseConsumer.getStorageData();
        if(node != null) {
            for(int year = LocalDate.now().getYear(); year >= LocalDate.now().minusYears(5L).getYear(); year--) {
                yearly.put(year + "", node.get(year + "").asInt());
            }
        }
        charts.put("yearly", yearly);
        result.put("charts", charts);

        //Get all appointments
        LocalDate monday = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate sunday = LocalDate.now().with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        result.put("appointments", bookingService.getAppointmentByPatientInWeek(patientId, monday.format(DateTimeFormatter.ofPattern("dd-MM-yyyy")), sunday.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"))));

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
