package com.verifyid.config;

import com.verifyid.entity.DocumentType;
import com.verifyid.entity.Role;
import com.verifyid.entity.User;
import com.verifyid.entity.UserStatus;
import com.verifyid.repository.DocumentTypeRepository;
import com.verifyid.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeData(
            DocumentTypeRepository documentTypeRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // -----------------------------
            // DOCUMENT TYPES
            // -----------------------------

            if (documentTypeRepository.count() == 0) {

                documentTypeRepository.save(new DocumentType(
                        "Bonafide Certificate",
                        "Official certificate confirming that the student is enrolled in the institution."
                ));

                documentTypeRepository.save(new DocumentType(
                        "Transcript",
                        "Official academic transcript containing the student's academic record."
                ));

                documentTypeRepository.save(new DocumentType(
                        "Migration Certificate",
                        "Official certificate issued for students migrating to another institution."
                ));

                documentTypeRepository.save(new DocumentType(
                        "Character Certificate",
                        "Official certificate regarding the student's conduct during their enrollment."
                ));

                System.out.println("VerifyID document types initialized.");
            }

            // -----------------------------
            // STAFF ACCOUNT
            // -----------------------------

            String staffEmail = System.getenv()
        .getOrDefault("VERIFYID_STAFF_EMAIL", "staff@verifyid.local");
String staffPassword = System.getenv()
        .getOrDefault("VERIFYID_STAFF_PASSWORD", "Staff@12345");

if (userRepository.findByEmail(staffEmail).isEmpty()) {

                User staff = new User();

                staff.setFullName("VerifyID Staff");
                staff.setEmail(staffEmail);
staff.setPassword(passwordEncoder.encode(staffPassword));
                staff.setRole(Role.STAFF);
                staff.setStatus(UserStatus.ACTIVE);

                userRepository.save(staff);

                System.out.println("VerifyID staff account initialized.");
            }
        };
    }
}