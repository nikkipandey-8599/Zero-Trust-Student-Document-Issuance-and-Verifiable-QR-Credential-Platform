package com.ztplatform.controller;

import com.ztplatform.dto.VerificationResponseDTO;
import com.ztplatform.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @GetMapping("/{credentialId}")
    public ResponseEntity<VerificationResponseDTO> verifyCredential(
            @PathVariable String credentialId,
            HttpServletRequest request
    ) {

        return ResponseEntity.ok(
                verificationService.verifyCredential(credentialId, request)
        );
    }
}