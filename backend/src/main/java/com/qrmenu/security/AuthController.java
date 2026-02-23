package com.qrmenu.security;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @PostMapping("/login")
    public Map<String, String> login() {

        return Map.of(
                "message", "Login disabled in testing mode"
        );
    }
}