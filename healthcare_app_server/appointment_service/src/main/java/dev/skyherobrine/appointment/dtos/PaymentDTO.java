package dev.skyherobrine.appointment.dtos;

import dev.skyherobrine.appointment.models.mongodb.BookAppointment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class PaymentDTO {
    private String authorName;
    private String bankingName;
    private double price;
    private String bookAppointmentId;
}
