package com.qrmenu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

// ✅ YOUR PROJECT IMPORTS
import com.qrmenu.shared.model.User;
import com.qrmenu.shared.model.Role;
import com.qrmenu.shared.enums.RoleName;
import com.qrmenu.shared.repository.UserRepository;
import com.qrmenu.shared.repository.RoleRepository;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.qrmenu.shared.repository")
@EntityScan(basePackages = "com.qrmenu.shared.model")
public class QrFoodApplication {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(QrFoodApplication.class, args);
    }

    // ✅ CREATE ADMIN USER AUTOMATICALLY
    @Bean
    public CommandLineRunner createAdmin() {
        return args -> {

            // 🔹 Step 1: Get or create ROLE_ADMIN
            Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setName(RoleName.ROLE_ADMIN);
                        return roleRepository.save(newRole);
                    });

            // 🔹 Step 2: Create admin user if not exists
            if (userRepository.findByUsername("admin").isEmpty()) {

                User user = new User();
                user.setUsername("admin");
                user.setPassword(passwordEncoder.encode("admin123"));
                user.setFullName("Admin");
                user.setRole(adminRole);

                userRepository.save(user);

                System.out.println("✅ Admin created: admin / admin123");
            }
        };
    }
}