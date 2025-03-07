package dev.skyherobrine.appointment.services;

import dev.skyherobrine.appointment.dtos.AppointmentDTO;
import dev.skyherobrine.appointment.feigns.DoctorFeign;
import dev.skyherobrine.appointment.models.mongodb.Appointment;
import dev.skyherobrine.appointment.repositories.mongodb.AppointmentRepository;
import dev.skyherobrine.appointment.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Service
@Slf4j
public class BookingService {

    private final DoctorFeign doctorFeign;
    private final KafkaTemplate<String,String> kafkaTemplate;
    private final AppointmentRepository ar;

    @Autowired
    public BookingService(DoctorFeign doctorFeign, KafkaTemplate<String, String> kafkaTemplate, AppointmentRepository ar) {
        this.doctorFeign = doctorFeign;
        this.kafkaTemplate = kafkaTemplate;
        this.ar = ar;
    }

    public Appointment booking(AppointmentDTO appointmentDTO) throws Exception {
        log.info("Booking Service: add the book appointment");
        Map<String,Object> dataSend = new HashMap<>();
        Appointment appointment = appointmentDTO.toObject();
        appointment.setRoomId(generateRoomId());

        dataSend.put("appointment", appointmentDTO);
        dataSend.put("roomId", appointment.getRoomId());
        log.info("Booking Service: send insert appointment message to kafka");
        kafkaTemplate.send("insert_appointment", ObjectParser.convertObjectToJson(dataSend));

        Appointment result = ar.save(appointment);
        log.info("Booking Service: add book appointment successfully");

        return result;
    }

    private String generateRoomId() {
        String getTimeNow = LocalDateTime.now().format(DateTimeFormatter.ofPattern("ddMMyyyyHHmmss"));
        String getRandomNumber = ThreadLocalRandom.current().nextInt(111111,999999) + "";
        return getRandomNumber + "-" + getTimeNow;
    }
}
