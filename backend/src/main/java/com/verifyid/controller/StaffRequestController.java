package com.verifyid.controller;

import com.verifyid.entity.DocumentRequest;
import com.verifyid.entity.RequestStatus;
import com.verifyid.repository.DocumentRequestRepository;
import com.verifyid.service.CredentialService;
import com.verifyid.service.AuditLogService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/staff/requests")
public class StaffRequestController {

    private final DocumentRequestRepository requestRepository;
    private final CredentialService credentialService;
    private final AuditLogService auditLogService;

    public StaffRequestController(
            DocumentRequestRepository requestRepository,
            CredentialService credentialService,
            AuditLogService auditLogService
    ) {
        this.requestRepository = requestRepository;
        this.credentialService = credentialService;
        this.auditLogService = auditLogService;
    }

    // GET /api/staff/requests/pending
    @GetMapping("/pending")
    public ResponseEntity<List<DocumentRequest>> getPendingRequests() {

        return ResponseEntity.ok(
                requestRepository.findByStatus(RequestStatus.SUBMITTED)
        );
    }

    // GET /api/staff/requests/approved
    @GetMapping("/approved")
    public ResponseEntity<List<DocumentRequest>> getApprovedRequests() {

        return ResponseEntity.ok(
                requestRepository.findByStatus(RequestStatus.APPROVED)
        );
    }

    // POST /api/staff/requests/{id}/approve
    @PostMapping("/{id}/approve")
    public ResponseEntity<DocumentRequest> approveRequest(
            @PathVariable Long id
    ) {

        DocumentRequest request = requestRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Request not found")
                );

        /*
         * A request can only be approved while it is waiting
         * for staff review.
         */
        if (request.getStatus() != RequestStatus.SUBMITTED
                && request.getStatus() != RequestStatus.UNDER_REVIEW) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only submitted or under-review requests can be approved"
            );
        }

        request.setStatus(RequestStatus.APPROVED);

        DocumentRequest saved = requestRepository.save(request);

        try {
            auditLogService.logCurrentUser(
                    "REQUEST_APPROVED",
                    "DOCUMENT_REQUEST",
                    id,
                    "Staff approved document request"
            );
        } catch (Exception ignored) {
            // Do not break the approval workflow if audit logging fails.
        }

        return ResponseEntity.ok(saved);
    }

    // POST /api/staff/requests/{id}/reject
    @PostMapping("/{id}/reject")
    public ResponseEntity<DocumentRequest> rejectRequest(
            @PathVariable Long id,
            @RequestParam String reason
    ) {

        DocumentRequest request = requestRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Request not found")
                );

        /*
         * A request can only be rejected while it is waiting
         * for staff review.
         *
         * Once approved, generated, issued or revoked,
         * it cannot be changed to REJECTED.
         */
        if (request.getStatus() != RequestStatus.SUBMITTED
                && request.getStatus() != RequestStatus.UNDER_REVIEW) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This request can no longer be rejected"
            );
        }

        request.setStatus(RequestStatus.REJECTED);
        request.setRejectionReason(reason);

        DocumentRequest saved = requestRepository.save(request);

        try {
            auditLogService.logCurrentUser(
                    "REQUEST_REJECTED",
                    "DOCUMENT_REQUEST",
                    id,
                    "Staff rejected document request: " + reason
            );
        } catch (Exception ignored) {
            // Do not break the rejection workflow if audit logging fails.
        }

        return ResponseEntity.ok(saved);
    }

    // POST /api/staff/requests/{id}/issue
    @PostMapping("/{id}/issue")
    public ResponseEntity<?> issueCredential(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                credentialService.issueCredential(id)
        );
    }
}