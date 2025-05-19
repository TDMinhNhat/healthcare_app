package dev.skyherobrine.admin.messages.consumes;

import dev.skyherobrine.admin.models.mariadb.Address;
import dev.skyherobrine.admin.repositories.mariadb.AddressRepository;
import dev.skyherobrine.admin.utils.ObjectParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AddressConsumers {

    private final AddressRepository ar;

    public AddressConsumers(AddressRepository ar) {
        this.ar = ar;
    }

    @KafkaListener(topics = "insert_address", id = "admin_insert_address")
    public void insertAddress(String message) throws Exception {
        log.info("Listen insert address message: {}", message);
        Address address = ObjectParser.convertJsonToObject(message, Address.class);
        Address newAddress = new Address(
                address.getNumber(),
                address.getStreet(),
                address.getWard(),
                address.getDistrict(),
                address.getCity(),
                address.getCountry()
        );
        ar.save(newAddress);
    }
}
