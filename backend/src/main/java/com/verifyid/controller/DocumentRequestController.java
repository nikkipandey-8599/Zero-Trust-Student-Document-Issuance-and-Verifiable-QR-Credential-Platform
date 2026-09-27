package com.verifyid.controller;

import com.verifyid.dto.CreateDocumentRequest;
import com.verifyid.entity.DocumentRequest;
import com.verifyid.entity.User;
import com.verifyid.service.AuditLogService;
import com.verifyid.service.DocumentRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class DocumentRequestController {

    private final DocumentRequestService requestService;
    private final AuditLogService auditLogService;

    public DocumentRequestController(
            DocumentRequestService requestService,
            AuditLogService auditLogService
    ) {
        this.requestService = requestService;
        this.auditLogService = auditLogService;
    }

    @PostMapping("/student/{studentId}")
    public ResponseEntity<DocumentRequest> createRequest(
            @PathVariable Long studentId,
            @RequestBody CreateDocumentRequest request,
            Authentication authentication
    ) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        verifyStudentAccess(
                authenticatedUser,
                studentId
        );

        DocumentRequest saved =
                requestService.createRequest(
                        studentId,
                        request
                );

        auditLogService.log(
                authenticatedUser.getId(),
                "DOCUMENT_REQUEST_CREATED",
                "DOCUMENT_REQUEST",
                saved.getId(),
                "Student submitted a document request"
        );

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<DocumentRequest>> getStudentRequests(
            @PathVariable Long studentId,
            Authentication authentication
    ) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        verifyStudentAccess(
                authenticatedUser,
                studentId
        );

        return ResponseEntity.ok(
                requestService.getStudentRequests(studentId)
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<List<DocumentRequest>> getPendingRequests() {

        return ResponseEntity.ok(
                requestService.getPendingRequests()
        );
    }

    private void verifyStudentAccess(
            User authenticatedUser,
            Long requestedStudentId
    ) {

        if (authenticatedUser.getId() == null ||
                !authenticatedUser.getId().equals(requestedStudentId)) {

            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN,
                    "You are not authorized to access this student's requests"
            );
        }
    }
}