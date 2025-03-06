package dev.skyherobrine.service.repositories.mongodb;

import dev.skyherobrine.service.models.mongodb.WorkSchedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkScheduleRepository extends MongoRepository<WorkSchedule,Long> {

    Optional<WorkSchedule> findTopByOrderByIdDesc();

    List<WorkSchedule> findAllByDoctor_UserId(String doctorId);
}
