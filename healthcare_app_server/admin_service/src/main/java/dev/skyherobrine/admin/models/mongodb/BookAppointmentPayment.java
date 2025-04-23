package dev.skyherobrine.admin.models.mongodb;

import dev.skyherobrine.admin.enums.PaymentStatus;
import dev.skyherobrine.admin.models.mariadb.Price;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "book_appointment_payments")
@Getter @Setter
@NoArgsConstructor
public class BookAppointmentPayment extends Payment {
    @Field(name = "book_appointment")
    private BookAppointment bookAppointment;

    public BookAppointmentPayment(Long id, Price price, String content, BookAppointment bookAppointment) {
        super(id, price, content);
        this.bookAppointment = bookAppointment;
    }

    public BookAppointmentPayment(Long id, Price price, String content, PaymentStatus status, BookAppointment bookAppointment) {
        super(id, price, content, status);
        this.bookAppointment = bookAppointment;
    }
}
