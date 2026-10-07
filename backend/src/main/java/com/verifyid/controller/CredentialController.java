package com.verifyid.controller;

import com.verifyid.entity.Credential;
import com.verifyid.entity.CredentialStatus;
import com.verifyid.entity.Role;
import com.verifyid.entity.User;
import com.verifyid.repository.CredentialRepository;
import com.verifyid.repository.UserRepository;
import com.verifyid.service.AuditLogService;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
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

    @GetMapping("/{credentialId}/pdf")
    public ResponseEntity<?> downloadPdf(
            @PathVariable String credentialId,
            Authentication authentication
    ) {
        Credential credential =
                credentialRepository
                        .findByCredentialId(credentialId)
                        .orElseThrow(() ->
                                new RuntimeException("Credential not found")
                        );

        User authenticatedUser =
                userRepository
                        .findByEmail(authentication.getName())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Authenticated user not found"
                                )
                        );

        boolean staffOrAdmin =
                authenticatedUser.getRole() == Role.STAFF ||
                authenticatedUser.getRole() == Role.ADMIN;

        boolean owner =
                credential.getRequest() != null &&
                credential.getRequest().getStudent() != null &&
                credential.getRequest().getStudent().getId()
                        .equals(authenticatedUser.getId());

        if (!staffOrAdmin && !owner) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "You are not authorized to access this credential"
                    ));
        }

        byte[] pdf = credential.getDocumentPdf();

        if (pdf == null || pdf.length == 0) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Credential PDF not available"
                    ));
        }

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_PDF);

        headers.setContentLength(pdf.length);

        headers.setContentDisposition(
                ContentDisposition
                        .attachment()
                        .filename(credentialId + ".pdf")
                        .build()
        );

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(headers)
                .body(pdf);
    }

    @PostMapping("/{credentialId}/revoke")
    public ResponseEntity<?> revokeCredential(
            @PathVariable String credentialId
    ) {
        Credential credential =
                credentialRepository
                        .findByCredentialId(credentialId)
                        .orElseThrow(() ->
                                new RuntimeException("Credential not found")
                        );

        if (credential.getStatus() == CredentialStatus.REVOKED) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Credential is already revoked"
                    ));
        }

        credential.setStatus(CredentialStatus.REVOKED);

        Credential saved =
                credentialRepository.save(credential);

        auditLogService.logCurrentUser(
                "CREDENTIAL_REVOKED",
                "CREDENTIAL",
                saved.getId(),
                "Credential " +
                        saved.getCredentialId() +
                        " was revoked"
        );

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
}