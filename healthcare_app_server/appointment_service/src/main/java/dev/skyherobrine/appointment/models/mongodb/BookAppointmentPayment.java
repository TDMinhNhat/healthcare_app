package dev.skyherobrine.appointment.models.mongodb;

import dev.skyherobrine.appointment.enums.PaymentStatus;
import dev.skyherobrine.appointment.models.mariadb.Price;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "book_appointment_payments")
@Getter @Setter
@NoArgsConstructor
public class BookAppointmentPayment extends Payment {
    private BookAppointment bookAppointmentId;

    public BookAppointmentPayment(Long id, Price price, String content, BookAppointment bookAppointmentId) {
        super(id, price, content);
        this.bookAppointmentId = bookAppointmentId;
    }

    public BookAppointmentPayment(Long id, Price price, String content, PaymentStatus status, BookAppointment bookAppointmentId) {
        super(id, price, content, status);
        this.bookAppointmentId = bookAppointmentId;
    }
}
