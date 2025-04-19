package dev.skyherobrine.appointment.controllers;

import dev.skyherobrine.appointment.dtos.AppointmentDTO;
import dev.skyherobrine.appointment.enums.AppointmentStatus;
import dev.skyherobrine.appointment.feigns.DoctorFeign;
import dev.skyherobrine.appointment.feigns.UserFeign;
import dev.skyherobrine.appointment.feigns.WorkScheduleFeign;
import dev.skyherobrine.appointment.models.Response;
import dev.skyherobrine.appointment.models.mongodb.BookAppointment;
import dev.skyherobrine.appointment.repositories.mongodb.BookAppointmentRepository;
import dev.skyherobrine.appointment.repositories.mongodb.MedicalRecordDrugRepository;
import dev.skyherobrine.appointment.repositories.mongodb.MedicalRecordRepository;
import dev.skyherobrine.appointment.services.BookingService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/appointment/api/v1/booking")
@Slf4j
public class BookingController {

    private final BookAppointmentRepository bar;
    private final BookingService bookingService;
    private final DoctorFeign doctorFeign;
    private final KafkaTemplate<String,String> kafkaTemplate;
    private final WorkScheduleFeign workScheduleFeign;
    private final UserFeign userFeign;
    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicalRecordDrugRepository medicalRecordDrugRepository;
    private final BookAppointmentRepository bookAppointmentRepository;

    public BookingController(BookAppointmentRepository bar, BookingService bookingService, DoctorFeign doctorFeign, KafkaTemplate<String, String> kafkaTemplate, WorkScheduleFeign workScheduleFeign, UserFeign userFeign, MedicalRecordRepository medicalRecordRepository, MedicalRecordDrugRepository medicalRecordDrugRepository, BookAppointmentRepository bookAppointmentRepository) {
        this.bar = bar;
        this.bookingService = bookingService;
        this.doctorFeign = doctorFeign;
        this.kafkaTemplate = kafkaTemplate;
        this.workScheduleFeign = workScheduleFeign;
        this.userFeign = userFeign;
        this.medicalRecordRepository = medicalRecordRepository;
        this.medicalRecordDrugRepository = medicalRecordDrugRepository;
        this.bookAppointmentRepository = bookAppointmentRepository;
    }

    @PostMapping
    public ResponseEntity<Response> bookingAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        try {
            log.info("Booking: Call the api booking appointment");
            Map<String,Object> result = bookingService.booking(appointmentDTO);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Booking appointment successfully",
                    result
            ));
        } catch (Exception e) {
            log.error("Booking: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api booking appointment was return an error",
                    e.getMessage()
            ));
        }
    }

    @DeleteMapping("/cancel")
    public ResponseEntity<Response> cancelAppointment(
            @RequestParam("bookAppointmentId") String bookAppointmentId
    ) {
        try {
            log.info("Booking: Call the api cancel appointment");
            kafkaTemplate.send("cancel_appointment", bookAppointmentId);

            BookAppointment bookAppointment = bar.findById(Long.parseLong(bookAppointmentId)).orElseThrow(() -> new EntityNotFoundException("The book appointment was not found!"));
            bookAppointment.setStatus(AppointmentStatus.CANCELLED);
            BookAppointment result = bar.save(bookAppointment);

            log.info("Booking: The appointment was canceled");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Cancel appointment successfully",
                    result
            ));
        } catch (Exception e) {
            log.error("Booking: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api cancel appointment was return an error",
                    e.getMessage()
                ));
        }
    }

    @GetMapping("/week/patient/{patientId}")
    public ResponseEntity<Response> getBookAppointmentByPatientInWeek(
            @PathVariable("patientId") String patientId,
            @RequestParam("start") String start,
            @RequestParam("end") String end
    ) {
        try {
            log.info("Booking: Call the api get book appointment by patient in week");
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get book appointment by patient in week successfully",
                    bookingService.getAppointmentByPatientInWeek(patientId, start, end)
            ));
        } catch (Exception e) {
            log.error("Booking: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api get book appointment by patient in week was return an error",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/detail")
    public ResponseEntity<Response> getAppointmentDetail(@RequestParam("workSchedule") Long workSchedule) {
        log.info("Booking: Call the api get appointment detail");
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get appointment detail successfully",
                bookingService.getAppointmentDetail(workSchedule)
        ));
    }

    @GetMapping("/detail/patient")
    public ResponseEntity<Response> getAppointmentDetailByPatient(
            @RequestParam("patientId") String patientId,
            @RequestParam("workSchedule") String workSchedule
    ) {
        try {
            log.info("Booking: Call the api get appointment detail by patient and work schedule");
            Map<String,Object> result = new HashMap<>();

            BookAppointment bookAppointment = bar.findByPatientIdAndWorkSchedule(patientId, Long.parseLong(workSchedule)).orElseThrow(() -> new EntityNotFoundException("The appointment wasn't found!"));

            result.put("book_appointment", bookAppointment);
            result.put("work_schedule", workScheduleFeign.getById(Long.parseLong(workSchedule)).getBody().getData());

            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get appointment detail by patient and work schedule",
                    result
            ));
        } catch (Exception e) {
            log.error("Booking: The api return an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api get appointment detail by patient and work schedule was return an error",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/detail/doctor")
    public ResponseEntity<Response> getAppointmentDetailByDoctor(
            @RequestParam String doctorId,
            @RequestParam String workSchedule
    ) {
        try {
            log.info("Booking: Call the api get appointment detail by doctor and work schedule");

            Map<String,Object> result = new HashMap<>();
            result.put("work_schedule", workScheduleFeign.getById(Long.parseLong(workSchedule)).getBody().getData());

            List<Map<String,Object>> patients = new ArrayList<>();
            bar.findByWorkSchedule(Long.parseLong(workSchedule)).forEach(bookAppointment -> {
                Map<String,Object> data = new HashMap<>();
                data.put("user_info", userFeign.getPatientByUserId(bookAppointment.getPatientId()).getBody().getData());
                data.put("book_appointment", bookAppointment);

                patients.add(data);
            });
            result.put("patients", patients);

            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get the appointment detail by doctor",
                    result
            ));
        } catch (Exception e) {
            log.error("Booking: The api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }

    @PutMapping("/status")
    public ResponseEntity<Response> updateStatusBookAppointment(
            @RequestParam String bookAppointmentId,
            @RequestParam String status
    ) {
        try {
            log.info("Booking: Call the api update status book appointment");
            BookAppointment bookAppointment = bar.findById(Long.parseLong(bookAppointmentId)).orElseThrow(() -> new EntityNotFoundException("The book appointment wasn't found!"));
            bookAppointment.setStatus(AppointmentStatus.valueOf(status));
            bar.save(bookAppointment);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Update status book appointment successfully",
                    bookAppointment
            ));
        } catch (Exception e) {
            log.error("Booking: The api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/previous")
    public ResponseEntity<Response> getMedicalRecordPrevious(
            @RequestParam String patientId,
            @RequestParam String bookAppointmentId
    ) {
        try {
            log.info("Booking: Call the api get the medical record previous");
            List<Map<String,Object>> result = new ArrayList<>();
            medicalRecordRepository.findByBookAppointment_PatientIdAndBookAppointment_IdNot(patientId, Long.parseLong(bookAppointmentId)).forEach(medicalRecord -> {
                Map<String,Object> data = new HashMap<>();
                data.put("medicalRecord", medicalRecord);
                data.put("drugs", medicalRecordDrugRepository.findById_MedicalRecord_Id(medicalRecord.getId()));

                result.add(data);
            });

            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get the medical records previous",
                    result
            ));
        } catch (Exception e) {
            log.error("Booking: The api thrown an error");
            log.error(e.getMessage());
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "The api thrown an error",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/status_done/work_schedule")
    public ResponseEntity<Response> getPatientDoneInWorkSchedule(
            @RequestParam("workScheduleId") String workScheduleId
    ) {
        log.info("Booking: Call the api get patient done in work schedule");
        List<Map<String,Object>> result = new ArrayList<>();

        bookAppointmentRepository.findByWorkScheduleAndStatus(Long.parseLong(workScheduleId), AppointmentStatus.DONE).forEach(item -> {
            Map<String,Object> data = new HashMap<>();
            data.put("bookAppointment", item);
            data.put("patient", userFeign.getPatientByUserId(item.getPatientId()).getBody().getData());
            result.add(data);
        });

        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get patient done in work schedule successfully",
                result
        ));
    }
}