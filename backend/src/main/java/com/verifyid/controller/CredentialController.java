package com.verifyid.controller;

import com.verifyid.entity.Credential;
import com.verifyid.entity.CredentialStatus;
import com.verifyid.entity.User;
import com.verifyid.repository.CredentialRepository;
import com.verifyid.repository.UserRepository;
import com.verifyid.service.AuditLogService;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/credentials")
public class CredentialController {

    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public CredentialController(
            CredentialRepository credentialRepository,
            UserRepository userRepository,
            AuditLogService auditLogService
    ) {
        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    // =========================================================
    // GET CREDENTIAL FOR A DOCUMENT REQUEST
    // =========================================================

    @GetMapping("/request/{requestId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getCredentialForRequest(
            @PathVariable Long requestId,
            Authentication authentication
    ) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    "Authentication required"
                            )
                    );
        }

        // =====================================================
        // Get authenticated user correctly
        // =====================================================

        User authenticatedUser =
                getAuthenticatedUser(authentication);

        if (authenticatedUser == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    "Authenticated user not found"
                            )
                    );
        }

        // =====================================================
        // Find credential for request
        // =====================================================

        Credential credential =
                credentialRepository
                        .findByRequestId(requestId)
                        .orElse(null);

        if (credential == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    "No credential has been issued for this request"
                            )
                    );
        }

        // =====================================================
        // Check staff/admin role
        // =====================================================

        boolean staffOrAdmin =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority -> {

                            String value =
                                    authority.getAuthority();

                            return "ROLE_STAFF".equals(value)
                                    || "ROLE_ADMIN".equals(value)
                                    || "STAFF".equals(value)
                                    || "ADMIN".equals(value);
                        });

        // =====================================================
        // Check credential owner
        // =====================================================

        boolean owner =
                credential.getRequest() != null
                        && credential.getRequest().getStudent() != null
                        && credential.getRequest()
                                .getStudent()
                                .getId()
                                .equals(
                                        authenticatedUser.getId()
                                );

        // =====================================================
        // Authorization
        // =====================================================

        if (!staffOrAdmin && !owner) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            Map.of(
                                    "message",
                                    "You are not authorized to view this credential"
                            )
                    );
        }

        // =====================================================
        // Return credential information
        // =====================================================

        return ResponseEntity.ok(
                Map.of(
                        "credentialId",
                        credential.getCredentialId(),

                        "status",
                        credential.getStatus().name(),

                        "issuedAt",
                        credential.getIssuedAt(),

                        "expiresAt",
                        credential.getExpiresAt()
                )
        );
    }

    // =========================================================
    // DOWNLOAD CREDENTIAL PDF
    // =========================================================

    @GetMapping("/{credentialId}/pdf")
    @Transactional(readOnly = true)
    public ResponseEntity<Resource> downloadPdf(
            @PathVariable String credentialId,
            Authentication authentication
    ) {

        Credential credential =
                credentialRepository
                        .findByCredentialId(credentialId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"
                                )
                        );

        // =====================================================
        // Authentication
        // =====================================================

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        // =====================================================
        // Get authenticated user correctly
        // =====================================================

        User authenticatedUser =
                getAuthenticatedUser(authentication);

        if (authenticatedUser == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        // =====================================================
        // Check Spring Security authorities
        // =====================================================

        boolean staffOrAdmin =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority -> {

                            String value =
                                    authority.getAuthority();

                            return "ROLE_STAFF".equals(value)
                                    || "ROLE_ADMIN".equals(value)
                                    || "STAFF".equals(value)
                                    || "ADMIN".equals(value);
                        });

        // =====================================================
        // Check credential owner
        // =====================================================

        boolean owner =
                credential.getRequest() != null
                        && credential.getRequest().getStudent() != null
                        && credential.getRequest()
                                .getStudent()
                                .getId()
                                .equals(
                                        authenticatedUser.getId()
                                );

        // =====================================================
        // Authorization
        // =====================================================

        if (!staffOrAdmin && !owner) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }

        // =====================================================
        // Get stored PDF
        // =====================================================

        byte[] pdf =
                credential.getDocumentPdf();

        if (pdf == null || pdf.length == 0) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }

        // =====================================================
        // Return PDF
        // =====================================================

        ByteArrayResource resource =
                new ByteArrayResource(pdf);

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_PDF
        );

        headers.setContentLength(
                pdf.length
        );

        headers.setContentDisposition(
                ContentDisposition
                        .attachment()
                        .filename(
                                credentialId + ".pdf"
                        )
                        .build()
        );

        headers.setCacheControl(
                "no-store, no-cache, must-revalidate, max-age=0"
        );

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(resource);
    }

    // =========================================================
    // REVOKE CREDENTIAL
    // =========================================================

    @PostMapping("/{credentialId}/revoke")
    public ResponseEntity<?> revokeCredential(
            @PathVariable String credentialId,
            Authentication authentication
    ) {

        // =====================================================
        // Authentication
        // =====================================================

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    "Authentication required"
                            )
                    );
        }

        // =====================================================
        // Only STAFF or ADMIN can revoke credentials
        // =====================================================

        boolean staffOrAdmin =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority -> {

                            String value =
                                    authority.getAuthority();

                            return "ROLE_STAFF".equals(value)
                                    || "ROLE_ADMIN".equals(value)
                                    || "STAFF".equals(value)
                                    || "ADMIN".equals(value);
                        });

        if (!staffOrAdmin) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            Map.of(
                                    "message",
                                    "Only staff or admin can revoke credentials"
                            )
                    );
        }

        // =====================================================
        // Find credential
        // =====================================================

        Credential credential =
                credentialRepository
                        .findByCredentialId(credentialId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"
                                )
                        );

        // =====================================================
        // Check already revoked
        // =====================================================

        if (credential.getStatus()
                == CredentialStatus.REVOKED) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Credential is already revoked"
                            )
                    );
        }

        // =====================================================
        // Revoke credential
        // =====================================================

        credential.setStatus(
                CredentialStatus.REVOKED
        );

        Credential saved =
                credentialRepository.save(
                        credential
                );

        // =====================================================
        // Audit log
        // =====================================================

        auditLogService.logCurrentUser(
                "CREDENTIAL_REVOKED",
                "CREDENTIAL",
                saved.getId(),
                "Credential " +
                        saved.getCredentialId() +
                        " was revoked"
        );

        // =====================================================
        // Response
        // =====================================================

        return ResponseEntity.ok(
                Map.of(
                        "credentialId",
                        saved.getCredentialId(),

                        "status",
                        saved.getStatus().name(),

                        "message",
                        "Credential revoked successfully"
                )
        );
    }

    // =========================================================
    // GET AUTHENTICATED USER
    // =========================================================

    private User getAuthenticatedUser(
            Authentication authentication
    ) {

        // Our JwtAuthenticationFilter stores the User object
        // directly as the authentication principal.

        Object principal =
                authentication.getPrincipal();

        if (principal instanceof User) {

            return (User) principal;
        }

        // Fallback in case another authentication mechanism
        // provides the email as the principal.

        String name =
                authentication.getName();

        if (name == null || name.isBlank()) {
            return null;
        }

        return userRepository
                .findByEmail(name)
                .orElse(null);
    }
}