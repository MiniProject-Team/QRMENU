package com.qrmenu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication

// ✅ Scan all JPA repositories
@EnableJpaRepositories(basePackages = "com.qrmenu.shared.repository")

// ✅ Scan all entity classes
@EntityScan(basePackages = "com.qrmenu.shared.model")

public class QrFoodApplication {

    public static void main(String[] args) {
        SpringApplication.run(QrFoodApplication.class, args);
    }
}