package com.verifyid.controller;

import com.verifyid.entity.RequestStatus;
import com.verifyid.repository.AuditLogRepository;
import com.verifyid.repository.CredentialRepository;
import com.verifyid.repository.DocumentRequestRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/staff/dashboard")
public class StaffDashboardController {

    private final DocumentRequestRepository requestRepository;
    private final CredentialRepository credentialRepository;
    private final AuditLogRepository auditLogRepository;

    public StaffDashboardController(
            DocumentRequestRepository requestRepository,
            CredentialRepository credentialRepository,
            AuditLogRepository auditLogRepository
    ) {
        this.requestRepository = requestRepository;
        this.credentialRepository = credentialRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {

        Map<String, Object> stats = new HashMap<>();

        stats.put(
                "pending",
                requestRepository.findByStatus(RequestStatus.SUBMITTED).size()
        );

        stats.put(
                "approved",
                requestRepository.findByStatus(RequestStatus.APPROVED).size()
        );

        stats.put(
                "rejected",
                requestRepository.findByStatus(RequestStatus.REJECTED).size()
        );

        stats.put(
                "issued",
                requestRepository.findByStatus(RequestStatus.ISSUED).size()
        );

        stats.put(
                "credentials",
                credentialRepository.count()
        );

        stats.put(
                "auditEvents",
                auditLogRepository.count()
        );

        stats.put("system", "UP");

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs() {
        return ResponseEntity.ok(
                auditLogRepository.findAllByOrderByCreatedAtDesc()
        );
    }
}