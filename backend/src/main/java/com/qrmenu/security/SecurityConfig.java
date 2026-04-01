package com.qrmenu.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // ❌ disable CSRF
            .csrf(csrf -> csrf.disable())

            // ✅ enable CORS
            .cors(cors -> {})

            // ❌ no session (JWT use kar rahe hai)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 🔓 AUTHORIZE REQUESTS
            .authorizeHttpRequests(auth -> auth

                // ✅ CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ✅ PUBLIC ROUTES
                .requestMatchers("/", "/test").permitAll()
                .requestMatchers("/api/menu/**").permitAll()
                .requestMatchers("/api/user/**").permitAll()
                .requestMatchers("/api/order/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()

                // 🔥 IMPORTANT: testing ke liye sab open
                .anyRequest().permitAll()
            )

            // ❌ JWT filter temporarily disable (testing ke liye)
            // .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            ;

        return http.build();
    }

    // 🔐 Password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔐 Auth manager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}