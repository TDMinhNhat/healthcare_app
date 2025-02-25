package dev.skyherobrine.service.services;

import dev.skyherobrine.service.models.User;
import dev.skyherobrine.service.repositories.DoctorRepository;
import dev.skyherobrine.service.repositories.PatientRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthenticateService {

    private final PatientRepository pr;
    private final DoctorRepository dr;

    public AuthenticateService(PatientRepository pr, DoctorRepository dr) {
        this.pr = pr;
        this.dr = dr;
    }

    public User checkLogin(String email, String password) {
        // Check the patient
        User patient = pr.findByEmailAndPassword(email, password).orElse(null);

        if(patient != null) {
            return patient;
        }

        // Check the doctor
        User doctor = dr.findByEmailAndPassword(email, password).orElse(null);
        if(doctor != null) {
            return doctor;
        }

        return null;
    }
}
