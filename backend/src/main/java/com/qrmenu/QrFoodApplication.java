package com.qrmenu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.qrmenu.shared.repository")  // ✅ FIX
@EntityScan(basePackages = "com.qrmenu.shared.model")                 // ✅ FIX
public class QrFoodApplication {

    public static void main(String[] args) {
        SpringApplication.run(QrFoodApplication.class, args);
    }
}