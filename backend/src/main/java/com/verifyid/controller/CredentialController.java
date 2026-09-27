package com.verifyid.controller;

import com.verifyid.entity.Credential;
import com.verifyid.entity.CredentialStatus;
import com.verifyid.repository.CredentialRepository;
import com.verifyid.service.AuditLogService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/credentials")
public class CredentialController {

    private final CredentialRepository credentialRepository;
    private final AuditLogService auditLogService;

    public CredentialController(
            CredentialRepository credentialRepository,
            AuditLogService auditLogService
    ) {
        this.credentialRepository = credentialRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping("/{credentialId}/pdf")
    public ResponseEntity<byte[]> downloadPdf(
            @PathVariable String credentialId
    ) {

        Credential credential =
                credentialRepository
                        .findByCredentialId(credentialId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"
                                )
                        );

        if (credential.getDocumentPdf() == null) {
            throw new RuntimeException(
                    "Credential PDF not available"
            );
        }

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_PDF
        );

        headers.setContentDisposition(
                ContentDisposition
                        .attachment()
                        .filename(credentialId + ".pdf")
                        .build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(credential.getDocumentPdf());
    }

    @PostMapping("/{credentialId}/revoke")
    public ResponseEntity<?> revokeCredential(
            @PathVariable String credentialId
    ) {

        Credential credential =
                credentialRepository
                        .findByCredentialId(credentialId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"
                                )
                        );

        if (credential.getStatus() == CredentialStatus.REVOKED) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "Credential is already revoked"
                    )
            );
        }

        credential.setStatus(
                CredentialStatus.REVOKED
        );

        Credential saved =
                credentialRepository.save(credential);

        auditLogService.logCurrentUser(
                "CREDENTIAL_REVOKED",
                "CREDENTIAL",
                saved.getId(),
                "Credential "
                        + saved.getCredentialId()
                        + " was revoked"
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