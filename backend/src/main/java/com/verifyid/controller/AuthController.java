package com.verifyid.controller;

import com.verifyid.dto.AuthResponse;
import com.verifyid.dto.LoginRequest;
import com.verifyid.dto.RegisterRequest;
import com.verifyid.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request
    ) {
        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(authService.register(request));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {
        try {
            return ResponseEntity.ok(
                    authService.login(request)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    public record ErrorResponse(String message) {
    }
}