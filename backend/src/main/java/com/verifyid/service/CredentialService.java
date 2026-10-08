package com.verifyid.service;

import com.verifyid.entity.Credential;
import com.verifyid.entity.CredentialStatus;
import com.verifyid.entity.DocumentRequest;
import com.verifyid.entity.RequestStatus;
import com.verifyid.repository.CredentialRepository;
import com.verifyid.repository.DocumentRequestRepository;
import com.verifyid.security.CryptoService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class CredentialService {

    private static final ZoneId INDIA_ZONE =
            ZoneId.of("Asia/Kolkata");

    private final CredentialRepository credentialRepository;
    private final DocumentRequestRepository documentRequestRepository;
    private final CryptoService cryptoService;
    private final PdfCredentialService pdfCredentialService;
    private final AuditLogService auditLogService;

    public CredentialService(
            CredentialRepository credentialRepository,
            DocumentRequestRepository documentRequestRepository,
            CryptoService cryptoService,
            PdfCredentialService pdfCredentialService,
            AuditLogService auditLogService
    ) {
        this.credentialRepository = credentialRepository;
        this.documentRequestRepository = documentRequestRepository;
        this.cryptoService = cryptoService;
        this.pdfCredentialService = pdfCredentialService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public Credential issueCredential(Long requestId) {

        // ==========================================
        // 1. Find request
        // ==========================================

        DocumentRequest request =
                documentRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Document request not found"
                                )
                        );

        // ==========================================
        // 2. Request must be approved
        // ==========================================

        if (request.getStatus() != RequestStatus.APPROVED) {

            throw new RuntimeException(
                    "Only approved requests can be issued"
            );
        }

        // ==========================================
        // 3. Prevent duplicate credentials
        // ==========================================

        if (credentialRepository
                .findByRequestId(requestId)
                .isPresent()) {

            throw new RuntimeException(
                    "Credential already issued for this request"
            );
        }

        // ==========================================
        // 4. Generate credential ID
        // ==========================================

        String credentialId =
                "VID-" +
                UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 8)
                        .toUpperCase();

        // ==========================================
        // 5. Create credential
        // ==========================================

        Credential credential = new Credential();

        credential.setCredentialId(credentialId);
        credential.setRequest(request);
        credential.setStatus(CredentialStatus.ACTIVE);

        /*
         * Always create credential timestamps in
         * Indian Standard Time so that the generated
         * credential and frontend display the same
         * time.
         */
        LocalDateTime issuedAt =
                LocalDateTime.now(INDIA_ZONE);

        LocalDateTime expiresAt =
                issuedAt.plusYears(1);

        credential.setIssuedAt(issuedAt);
        credential.setExpiresAt(expiresAt);

        // ==========================================
        // 6. Generate PDF
        // ==========================================

        byte[] pdfBytes =
                pdfCredentialService.generateCredentialPdf(
                        credential,
                        request
                );

        // ==========================================
        // 7. Hash the actual PDF
        // ==========================================

        String documentHash =
                sha256(pdfBytes);

        // ==========================================
        // 8. Digitally sign credential + PDF hash
        // ==========================================

        String dataToSign =
                credentialId +
                ":" +
                documentHash;

        String signature =
                cryptoService.sign(dataToSign);

        // ==========================================
        // 9. Store security information
        // ==========================================

        credential.setDocumentHash(documentHash);
        credential.setSignature(signature);
        credential.setDocumentPdf(pdfBytes);

        // ==========================================
        // 10. Save credential
        // ==========================================

        Credential savedCredential =
                credentialRepository.save(credential);

        // ==========================================
        // 11. Mark request as ISSUED
        // ==========================================

        request.setStatus(RequestStatus.ISSUED);

        documentRequestRepository.save(request);

        // ==========================================
        // 12. Audit trail
        // ==========================================

        auditLogService.logCurrentUser(
                "CREDENTIAL_ISSUED",
                "CREDENTIAL",
                savedCredential.getId(),
                "Credential " +
                        savedCredential.getCredentialId() +
                        " issued for document request " +
                        request.getId()
        );

        // ==========================================
        // 13. Return credential
        // ==========================================

        return savedCredential;
    }

    // ==============================================
    // SHA-256
    // ==============================================

    private String sha256(byte[] data) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash =
                    digest.digest(data);

            return HexFormat.of()
                    .formatHex(hash);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to generate document hash",
                    e
            );
        }
    }
}