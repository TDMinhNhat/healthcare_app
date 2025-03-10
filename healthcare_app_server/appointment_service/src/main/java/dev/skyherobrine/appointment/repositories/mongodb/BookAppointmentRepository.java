package dev.skyherobrine.appointment.repositories.mongodb;

import dev.skyherobrine.appointment.models.mongodb.BookAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookAppointmentRepository extends MongoRepository<BookAppointment,Long> {
}
