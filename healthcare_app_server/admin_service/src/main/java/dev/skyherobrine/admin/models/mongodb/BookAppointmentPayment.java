package dev.skyherobrine.admin.models.mongodb;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "book_appointment_payments")
@Getter @Setter
@NoArgsConstructor
public class BookAppointmentPayment extends Payment {
    private String bookAppointmentId;

    public BookAppointmentPayment(Long id, Double price, String content, String bookAppointmentId) {
        super(id, price, content);
        this.bookAppointmentId = bookAppointmentId;
    }
}
