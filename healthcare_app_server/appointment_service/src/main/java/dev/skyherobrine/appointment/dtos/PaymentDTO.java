package dev.skyherobrine.appointment.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class PaymentDTO {
    private String accountNumber;
    private String subAccount;
    private String bankingName;
    private double price;
    private String bookAppointmentId;
    private String content;
}
