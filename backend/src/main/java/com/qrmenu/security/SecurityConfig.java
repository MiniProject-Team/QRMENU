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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

   @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> {}) // updated (no deprecated warning)
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth

            // ✅ CORS preflight
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

            // ✅ PUBLIC ROUTES (NO LOGIN REQUIRED)
            .requestMatchers("/", "/test").permitAll()
            .requestMatchers("/api/menu/**").permitAll()
            .requestMatchers("/api/order/**").permitAll()
            .requestMatchers("/api/auth/**").permitAll()

            // 🔥 IMPORTANT: allow guest menu access
            .requestMatchers("/api/user/menu").permitAll()

            // ✅ USER ROUTES (login required)
            .requestMatchers("/api/user/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

            // ✅ ADMIN ROUTES
            .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")

            // ✅ KITCHEN ROUTES
            .requestMatchers("/api/kitchen/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_KITCHEN")

            // 🔐 बाकी सब protected
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

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