package com.qrmenu.security;

import lombok.RequiredArgsConstructor;
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

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // ❌ disable CSRF
            .csrf(csrf -> csrf.disable())

            // ✅ ENABLE CORS (IMPORTANT)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // ❌ no session (JWT)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 🔐 authorization
            .authorizeHttpRequests(auth -> auth

                // ✅ allow preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ✅ PUBLIC APIs
                .requestMatchers("/", "/test").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/menu/**").permitAll()
                .requestMatchers("/api/user/menu").permitAll()
                .requestMatchers("/api/order/**").permitAll()

                // 🔐 PROTECTED
                .requestMatchers("/api/user/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/api/kitchen/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_KITCHEN")

                .anyRequest().authenticated()
            )

            // ✅ JWT filter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 🔥🔥🔥 MOST IMPORTANT (CORS FIX)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
            "https://qrmenu-psi-one.vercel.app"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));

        // ⚠️ required for frontend
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    // ✅ REQUIRED (fix your previous error)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ auth manager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}