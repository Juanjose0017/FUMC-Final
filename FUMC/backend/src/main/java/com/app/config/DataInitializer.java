package com.app.config;

import com.app.model.User;
import com.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setSecondName(null);
            admin.setFirstLastName("Sistema");
            admin.setSecondLastName("Principal");
            admin.setCedula("0000000000");
            admin.setEmail("admin@fumc.edu.co");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Usuario administrador creado: admin / admin123");
        }
    }
}
