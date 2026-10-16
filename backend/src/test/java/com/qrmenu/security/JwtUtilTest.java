package com.qrmenu.security;

import io.jsonwebtoken.security.WeakKeyException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {
    @Test
    void requiresConfiguredStrongSecret() {
        assertThrows(IllegalArgumentException.class, () -> new JwtUtil(""));
        assertThrows(IllegalArgumentException.class, () -> new JwtUtil(null));
        assertThrows(WeakKeyException.class, () -> new JwtUtil("short"));
    }

    @Test
    void rotatingSigningKeyRejectsPreviouslyIssuedTokens() {
        JwtUtil previous = new JwtUtil("test-only-previous-signing-key-000000000000");
        JwtUtil current = new JwtUtil("test-only-replacement-signing-key-000000000");
        String token = previous.generateToken("test-user", "USER");

        assertTrue(previous.validateToken(token));
        assertEquals("test-user", previous.extractUsername(token));
        assertFalse(current.validateToken(token));
        assertTrue(current.validateToken(current.generateToken("test-user", "USER")));
    }
}
