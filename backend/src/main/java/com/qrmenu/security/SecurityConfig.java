package com.qrmenu.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http

            // ❌ Disable CSRF
            .csrf(csrf -> csrf.disable())

            // ✅ Enable CORS
            .cors(cors -> {})

            // ❌ Stateless session (JWT)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 🔐 Authorization rules
            .authorizeHttpRequests(auth -> auth

                // ✅ Allow preflight (IMPORTANT for frontend)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ✅ PUBLIC APIs (no login required)
                .requestMatchers("/", "/test").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/menu/**").permitAll()
                .requestMatchers("/api/user/menu").permitAll()
                .requestMatchers("/api/order/**").permitAll()

                // 👤 USER APIs (login required)
                .requestMatchers("/api/user/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                // 👨‍💼 ADMIN APIs
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")

                // 👨‍🍳 KITCHEN APIs
                .requestMatchers("/api/kitchen/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_KITCHEN")

                // 🔐 All other requests need authentication
                .anyRequest().authenticated()
            )

            // ✅ JWT Filter
         .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 🔐 Authentication Manager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}