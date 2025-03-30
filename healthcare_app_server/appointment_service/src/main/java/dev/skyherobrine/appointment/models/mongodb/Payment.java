package dev.skyherobrine.appointment.models.mongodb;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "payments")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Payment {

    @MongoId
    private Long id;
    @Field(name = "account_number")
    private String accountNumber;
    @Field(name = "sub_account")
    private String subAccount;
    @Field(name = "banking_name")
    private String bankingName;
    private double price;
    @Field(name = "book_appointment")
    private BookAppointment bookAppointment;
    private String content;
    @Field(name = "created_at")
    private LocalDateTime createdAt;
}
