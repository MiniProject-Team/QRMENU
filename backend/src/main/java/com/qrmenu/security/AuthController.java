package com.qrmenu.security;

import com.qrmenu.security.dto.AuthResponse;
import com.qrmenu.security.dto.LoginRequest;
import com.qrmenu.security.dto.RegisterRequest;
import com.qrmenu.shared.enums.RoleName;
import com.qrmenu.shared.model.Role;
import com.qrmenu.shared.model.User;
import com.qrmenu.shared.repository.RoleRepository;
import com.qrmenu.shared.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepo.findByUsername(request.getUsername()).orElseThrow();
        String roleName = user.getRole().getName().name();
        String token = jwtUtil.generateToken(user.getUsername(), roleName);

        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), roleName));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        if (userRepo.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        RoleName roleName = RoleName.valueOf(request.getRole());
        Role role = roleRepo.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(role);

        userRepo.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), roleName.name());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), roleName.name()));
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> profile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepo.findByUsername(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "fullName", user.getFullName() != null ? user.getFullName() : "",
                "role", user.getRole().getName().name()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}