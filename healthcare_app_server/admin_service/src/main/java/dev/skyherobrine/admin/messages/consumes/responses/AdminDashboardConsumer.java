package dev.skyherobrine.admin.messages.consumes.responses;

import dev.skyherobrine.admin.repositories.mariadb.DoctorRepository;
import dev.skyherobrine.admin.repositories.mariadb.PatientRepository;
import dev.skyherobrine.admin.repositories.mariadb.PriceRepository;
import dev.skyherobrine.admin.repositories.mongodb.*;
import dev.skyherobrine.admin.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.IsoFields;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@Slf4j
public class AdminDashboardConsumer {

    private final KafkaTemplate<String,String> kafkaTemplate;
    private final BookAppointmentRepository bookAppointmentRepository;
    private final BookAppointmentPaymentRepository bookAppointmentPaymentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicalRecordDrugRepository medicalRecordDrugRepository;
    private final PriceRepository priceRepository;
    private final WorkScheduleRepository workScheduleRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public AdminDashboardConsumer(KafkaTemplate<String, String> kafkaTemplate, BookAppointmentRepository bookAppointmentRepository, BookAppointmentPaymentRepository bookAppointmentPaymentRepository, MedicalRecordRepository medicalRecordRepository, MedicalRecordDrugRepository medicalRecordDrugRepository, PriceRepository priceRepository, WorkScheduleRepository workScheduleRepository, DoctorRepository doctorRepository, PatientRepository patientRepository) {
        this.kafkaTemplate = kafkaTemplate;
        this.bookAppointmentRepository = bookAppointmentRepository;
        this.bookAppointmentPaymentRepository = bookAppointmentPaymentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.medicalRecordDrugRepository = medicalRecordDrugRepository;
        this.priceRepository = priceRepository;
        this.workScheduleRepository = workScheduleRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @KafkaListener(topics = "request_get_admin_dashboard", groupId = "admin_get_admin_dashboard")
    public void getAdminDashboard(String message) {
        try {
            log.info("Admin Dashboard Consumer: Call the api get admin dashboard");
            Map<String,Object> result = new HashMap<>();

            //Get the total of statistics
            //// Salary
            result.put("salaries", new HashMap<>(){{
                put("total", bookAppointmentPaymentRepository.findAll().stream().mapToDouble(bookAppointmentPayment -> bookAppointmentPayment.getPrice().getPrice()).reduce(0.0, Double::sum));
                put("total_this_year", bookAppointmentPaymentRepository.findAll().stream().filter(item -> item.getBookAppointment().getWorkSchedule().getDateAppointment().getYear() == LocalDate.now().getYear()).toList().stream().mapToDouble(bookAppointmentPayment -> bookAppointmentPayment.getPrice().getPrice()).reduce(0.0, Double::sum));
                put("total_previous_year", bookAppointmentPaymentRepository.findAll().stream().filter(item -> item.getBookAppointment().getWorkSchedule().getDateAppointment().getYear() == LocalDate.now().minusYears(1L).getYear()).toList().stream().mapToDouble(bookAppointmentPayment -> bookAppointmentPayment.getPrice().getPrice()).reduce(0.0, Double::sum));
            }});

            //// Patients
            result.put("patients", new HashMap<>(){{
                put("total", patientRepository.findAll().size());
                put("total_this_year", patientRepository.findAll().stream().filter(patient -> patient.getCreatedAt().getYear() == LocalDateTime.now().getYear()).count());
                put("total_previous_year", patientRepository.findAll().stream().filter(patient -> patient.getCreatedAt().getYear() == LocalDateTime.now().minusYears(1L).getYear()).count());
            }});

            //// Doctors
            result.put("doctors", new HashMap<>(){{
                put("total", doctorRepository.findAll().size());
                put("total_this_year", doctorRepository.findAll().stream().filter(doctor -> doctor.getCreatedAt().getYear() == LocalDateTime.now().getYear()).count());
                put("total_previous_year", doctorRepository.findAll().stream().filter(doctor -> doctor.getCreatedAt().getYear() == LocalDateTime.now().minusYears(1L).getYear()).count());
            }});

            //Visualize appointment
            Map<String,Object> visualize = new HashMap<>();
            //// Salaries:
            Map<String,Object> salaries = new HashMap<>();
            salaries.put("quarter", bookAppointmentPaymentRepository.findAll().stream().filter(bookAppointmentPayment -> bookAppointmentPayment.getBookAppointment().getWorkSchedule().getDateAppointment().getYear() == LocalDate.now().getYear()).collect(
                    Collectors.groupingBy(
                            bookAppointmentPayment -> bookAppointmentPayment.getBookAppointment().getWorkSchedule().getDateAppointment().get(IsoFields.QUARTER_OF_YEAR),
                            Collectors.reducing(0.0, bookAppointmentPayment -> bookAppointmentPayment.getPrice().getPrice(), Double::sum)
                    )
            ));
            salaries.put("month", bookAppointmentPaymentRepository.findAll().stream().collect(
                    Collectors.groupingBy(
                            bookAppointmentPayment -> bookAppointmentPayment.getBookAppointment().getWorkSchedule().getDateAppointment().getMonth(),
                            Collectors.reducing(0.0, bookAppointmentPayment -> bookAppointmentPayment.getPrice().getPrice(), Double::sum)
                    )));
            salaries.put("year", bookAppointmentPaymentRepository.findAll().stream().collect(
                    Collectors.groupingBy(
                            bookAppointmentPayment -> bookAppointmentPayment.getBookAppointment().getWorkSchedule().getDateAppointment().getYear(),
                            Collectors.reducing(0.0, bookAppointmentPayment -> bookAppointmentPayment.getPrice().getPrice(), Double::sum)
                    )));
            visualize.put("salaries", salaries);

            //// Patient appointment:
            Map<String,Object> patients = new HashMap<>();
            patients.put("quarter", bookAppointmentRepository.findAll().stream().collect(
                    Collectors.groupingBy(
                            bookAppointment -> bookAppointment.getWorkSchedule().getDateAppointment().get(IsoFields.QUARTER_OF_YEAR),
                            Collectors.counting()
                    )
            ));
            patients.put("month", bookAppointmentRepository.findAll().stream().collect(
                    Collectors.groupingBy(
                            bookAppointment -> bookAppointment.getWorkSchedule().getDateAppointment().getMonth(),
                            Collectors.counting()
                    )
            ));
            patients.put("year", bookAppointmentRepository.findAll().stream().collect(
                    Collectors.groupingBy(
                            bookAppointment -> bookAppointment.getWorkSchedule().getDateAppointment().getYear(),
                            Collectors.counting()
                    )
            ));
            visualize.put("patients", patients);

            result.put("visualize", visualize);
            kafkaTemplate.send("response_get_admin_dashboard", ObjectParser.convertObjectToJson(result)).get();
            kafkaTemplate.flush();
        } catch (Exception e) {
            log.error("Admin Dashboard Consumer: the consumer thrown an error");
            log.error("Admin Dashboard Consumer: {}", e.getMessage());
            kafkaTemplate.send("response_get_admin_dashboard", "Error: " + e.getMessage());
            kafkaTemplate.flush();
        }
    }
}
