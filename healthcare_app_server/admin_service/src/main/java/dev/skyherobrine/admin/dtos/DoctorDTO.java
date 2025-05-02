package dev.skyherobrine.admin.dtos;

import dev.skyherobrine.admin.enums.Diploma;
import dev.skyherobrine.admin.models.mariadb.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Getter @Setter
@AllArgsConstructor
public class DoctorDTO {

    private String firstName;
    private String lastName;
    private Boolean sex;
    private String dob;
    private String phone;
    private String email;
    private String password;
    private String specialization;
    private String typeDisease;
    private List<DoctorCertificateDTO> certificates;
    private List<DoctorEducationDTO> educations;
    private List<DoctorExperienceDTO> experiences;

    public List<DoctorCertificate> certificates(Doctor doctor) {
        return certificates.stream().map(certificate -> new DoctorCertificate(
                doctor, certificate.getCertName(), LocalDate.parse(certificate.getIssueDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy"))
        )).toList();
    }

    public List<DoctorEducation> educations(Doctor doctor) {
        return educations.stream().map(education -> new DoctorEducation(
                doctor, education.getSchoolName(), LocalDate.parse(education.getJoinDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")), LocalDate.parse(education.getGraduateDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")), education.getDiploma()
        )).toList();
    }

    public List<DoctorExperience> experiences(Doctor doctor) {
        return experiences.stream().map(experience -> new DoctorExperience(
                doctor, experience.getCompanyName(), experience.getSpecialization(), LocalDate.parse(experience.getStartDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")), LocalDate.parse(experience.getEndDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")), experience.getAddress().toObject(), experience.getDescription()
        )).toList();
    }

    @Getter @Setter
    @AllArgsConstructor
    public static class DoctorCertificateDTO {
        private String certName;
        private String issueDate;
    }

    @Getter @Setter
    @AllArgsConstructor
    public static class DoctorEducationDTO {
        private String schoolName;
        private String joinDate;
        private String graduateDate;
        private Diploma diploma;
    }

    @Getter @Setter
    @AllArgsConstructor
    public static class DoctorExperienceDTO {
        private String companyName;
        private String specialization;
        private String startDate;
        private String endDate;
        private AddressRegisterDTO address;
        private String description;
    }
}
