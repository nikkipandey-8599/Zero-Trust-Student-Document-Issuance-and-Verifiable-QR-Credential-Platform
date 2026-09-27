package com.verifyid.controller;

import com.verifyid.entity.Credential;
import com.verifyid.entity.CredentialStatus;
import com.verifyid.repository.CredentialRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.verifyid.security.CryptoService;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/verify")
public class VerificationController {

    private final CredentialRepository credentialRepository;
    private final CryptoService cryptoService;

    public VerificationController(
        CredentialRepository credentialRepository,
        CryptoService cryptoService) {

    this.credentialRepository = credentialRepository;
    this.cryptoService = cryptoService;
}
    @GetMapping("/{credentialId}")
    public ResponseEntity<?> verifyCredential(
            @PathVariable String credentialId) {

        Credential credential =
                credentialRepository
                        .findByCredentialId(credentialId)
                        .orElse(null);

        if (credential == null) {
            return ResponseEntity.ok(
                    result(
                            false,
                            "CREDENTIAL_NOT_FOUND",
                            null
                    )
            );
        }


        boolean signatureValid =
        cryptoService.verify(
                credential.getCredentialId()
                        + ":"
                        + credential.getDocumentHash(),
                credential.getSignature()
        );

if (!signatureValid) {

    return ResponseEntity.ok(
            result(
                    false,
                    "SIGNATURE_INVALID",
                    credential
            )
    );
}

        if (credential.getStatus() == CredentialStatus.REVOKED) {
            return ResponseEntity.ok(
                    result(
                            false,
                            "CREDENTIAL_REVOKED",
                            credential
                    )
            );
        }

        if (credential.getExpiresAt() != null &&
                credential.getExpiresAt()
                        .isBefore(LocalDateTime.now())) {

            return ResponseEntity.ok(
                    result(
                            false,
                            "CREDENTIAL_EXPIRED",
                            credential
                    )
            );
        }

        return ResponseEntity.ok(
                result(
                        true,
                        "CREDENTIAL_VALID",
                        credential
                )
        );
    }

    private Map<String, Object> result(
            boolean valid,
            String status,
            Credential credential) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("valid", valid);
        response.put("status", status);

        if (credential != null) {

            response.put(
                    "credentialId",
                    credential.getCredentialId()
            );

            response.put(
                    "documentType",
                    credential.getRequest()
                            .getDocumentType()
                            .getName()
            );

            response.put(
                    "studentName",
                    credential.getRequest()
                            .getStudent()
                            .getFullName()
            );

            response.put(
                    "issuedAt",
                    credential.getIssuedAt()
            );

            response.put(
                    "expiresAt",
                    credential.getExpiresAt()
            );

            response.put(
                    "documentHash",
                    credential.getDocumentHash()
            );
        }

        return response;
    }
}