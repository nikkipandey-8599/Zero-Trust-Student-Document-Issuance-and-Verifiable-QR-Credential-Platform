package com.ztplatform.service;

import com.ztplatform.config.AppConfig.InstitutionProperties;
import com.ztplatform.dto.VerificationResponseDTO;
import com.ztplatform.model.Credential;
import com.ztplatform.model.RevokedCredential;
import com.ztplatform.model.VerificationLog;
import com.ztplatform.repository.CredentialRepository;
import com.ztplatform.repository.RevokedCredentialRepository;
import com.ztplatform.repository.VerificationLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final CredentialRepository credentialRepository;
    private final DigitalSignatureService digitalSignatureService;
    private final VerificationLogRepository verificationLogRepository;
    private final RevokedCredentialRepository revokedCredentialRepository;
    private final InstitutionProperties institutionProperties;

    public VerificationResponseDTO verifyCredential(String credentialId, HttpServletRequest request) {

        Credential credential = credentialRepository
                .findByCredentialId(credentialId)
                .orElse(null);

        String result;
        String status;

        if (credential == null) {
            result = "NOT_FOUND";
            status = "NOT_FOUND";
        } else if (credential.getStatus() == Credential.CredentialStatus.REVOKED) {
            result = "REVOKED";
            status = "REVOKED";
        } else if (credential.getExpiresAt() != null &&
                credential.getExpiresAt().isBefore(LocalDateTime.now())) {
            credential.setStatus(Credential.CredentialStatus.EXPIRED);
            credentialRepository.save(credential);
            result = "EXPIRED";
            status = "EXPIRED";
        } else if (credential.getStatus() == Credential.CredentialStatus.DRAFT) {
            result = "INVALID";
            status = "INVALID";
        } else if (credential.getStatus() == Credential.CredentialStatus.VALID) {
            result = "VALID";
            status = "VALID";
        } else {
            // Verify digital signature
            String dataToVerify =
                    credential.getCredentialId() + "|" +
                    credential.getDocument().getId() + "|" +
                    credential.getDocument().getStudent().getStudentId() + "|" +
                    credential.getDocument().getDocumentType().name() + "|" +
                    credential.getDocument().getTitle();

            boolean signatureValid = digitalSignatureService.verify(
                    dataToVerify,
                    credential.getDigitalSignature()
            );

            if (!signatureValid) {
                result = "INVALID";
                status = "INVALID";
            } else {
                result = "VALID";
                status = "ACTIVE";
            }
        }

        // Log verification attempt
        if (credential != null) {
            logVerification(credential, result, request);
        }

        return buildResponse(credential, status, result);
    }

    private void logVerification(Credential credential, String result, HttpServletRequest request) {
        VerificationLog log = new VerificationLog();
        log.setCredential(credential);
        log.setVerifierType(VerificationLog.VerifierType.PUBLIC);
        log.setVerificationMethod(VerificationLog.VerificationMethod.CREDENTIAL_ID);
        log.setResult(VerificationLog.VerificationResult.valueOf(result));
        log.setIpAddress(getClientIpAddress(request));
        log.setUserAgent(request.getHeader("User-Agent"));
        verificationLogRepository.save(log);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getHeader("X-Real-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }

    private VerificationResponseDTO buildResponse(
            Credential credential,
            String status,
            String result
    ) {
        if (credential == null) {
            VerificationResponseDTO response = new VerificationResponseDTO();
            response.setValid(false);
            response.setStatus("NOT_FOUND");
            return response;
        }

        Boolean isValid = "VALID".equals(result);
        String studentName = credential.getDocument().getStudent().getUser().getName();
        String studentId = credential.getDocument().getStudent().getStudentId();
        String institution = institutionProperties.getName();

        VerificationResponseDTO response = new VerificationResponseDTO(
                isValid,
                status,
                credential.getCredentialId(),
                studentName,
                studentId,
                institution,
                credential.getDocument().getDocumentType().name(),
                credential.getDocument().getTitle(),
                credential.getIssuedAt()
        );

        response.setExpiryDate(credential.getExpiresAt());

        if ("REVOKED".equals(result)) {
            RevokedCredential revoked = revokedCredentialRepository.findByCredential(credential).orElse(null);
            if (revoked != null) {
                response.setRevokedDate(revoked.getRevokedAt());
                response.setRevocationReason(revoked.getReason());
            }
        }

        return response;
    }
}