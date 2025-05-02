package dev.skyherobrine.authenticate.repositories.mongodb;

import dev.skyherobrine.authenticate.models.mongodb.WorkSchedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkScheduleRepository extends MongoRepository<WorkSchedule,Long> {

    Optional<WorkSchedule> findTopByOrderByIdDesc();

    List<WorkSchedule> findAllByDoctor_UserId(String doctorId);

    List<WorkSchedule> findByDateAppointmentBetween(LocalDate dateAppointmentStart, LocalDate dateAppointmentEnd);

    List<WorkSchedule> findByDoctor_UserIdAndDateAppointmentBetween(String doctorId, LocalDate dateAppointmentStart, LocalDate dateAppointmentEnd);

    List<WorkSchedule> findByDoctor_UserIdAndDateAppointment(String doctorId, LocalDate dateAppointment);

    List<WorkSchedule> findByIdInOrderByDateAppointmentDesc(Collection<Long> ids);
}
