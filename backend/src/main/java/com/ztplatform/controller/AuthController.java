package com.ztplatform.controller;

import com.ztplatform.dto.AuthDTO;
import com.ztplatform.model.User;
import com.ztplatform.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @Valid @RequestBody AuthDTO authDTO,
            HttpServletRequest request) {

        String token = authService.login(authDTO);

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "message", "Login successful"
                )
        );
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {

        User createdUser = authService.register(user);

        // Password response mein kabhi return nahi karna
        createdUser.setPassword(null);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdUser);
    }
}