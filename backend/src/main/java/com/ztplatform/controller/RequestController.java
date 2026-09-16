package com.ztplatform.controller;

import com.ztplatform.dto.RequestDTO;
import com.ztplatform.model.User;
import com.ztplatform.service.AuthService;
import com.ztplatform.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<RequestDTO> createRequest(
            @RequestBody RequestDTO requestDTO
    ) {
        return ResponseEntity.ok(
                requestService.createRequest(requestDTO)
        );
    }

    @GetMapping
    public ResponseEntity<List<RequestDTO>> getAllRequests() {
        return ResponseEntity.ok(
                requestService.getAllRequests()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestDTO> getRequestById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                requestService.getRequestById(id)
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<RequestDTO>> getRequestsByStudent(
            @PathVariable Long studentId
    ) {
        return ResponseEntity.ok(
                requestService.getRequestsByStudent(studentId)
        );
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<RequestDTO> approveRequest(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User admin = authService.findByEmail(email);

        return ResponseEntity.ok(
                requestService.approveRequest(id, admin)
        );
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<RequestDTO> rejectRequest(
            @PathVariable Long id,
            @RequestParam String reason,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User admin = authService.findByEmail(email);

        return ResponseEntity.ok(
                requestService.rejectRequest(id, admin, reason)
        );
    }
}