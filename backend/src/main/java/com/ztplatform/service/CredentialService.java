package com.ztplatform.service;

import com.ztplatform.dto.CredentialDTO;
import com.ztplatform.model.Credential;
import com.ztplatform.model.Document;
import com.ztplatform.model.User;
import com.ztplatform.repository.CredentialRepository;
import com.ztplatform.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CredentialService {

    private final CredentialRepository credentialRepository;
    private final DocumentRepository documentRepository;
    private final DigitalSignatureService digitalSignatureService;

    public Credential getCredentialEntityByCredentialId(
            String credentialId) {

        return credentialRepository
                .findByCredentialId(credentialId)
                .orElseThrow(() -> new RuntimeException(
                        "Credential not found"));
    }

    public CredentialDTO createCredential(Long documentId, User createdBy) {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (credentialRepository.findByDocumentId(documentId).isPresent()) {
            throw new RuntimeException(
                    "Credential already exists for this document");
        }

        Credential credential = new Credential();

        String credentialId = generateCredentialId();

        credential.setCredentialId(credentialId);
        credential.setDocument(document);
        credential.setCredentialName(document.getTitle() + " Credential");
        credential.setCreatedBy(createdBy);

        String dataToSign = credentialId + "|" +
                document.getId() + "|" +
                document.getStudent().getStudentId() + "|" +
                document.getDocumentType().name() + "|" +
                document.getTitle();

        String digitalSignature = digitalSignatureService.sign(dataToSign);

        credential.setDigitalSignature(digitalSignature);

        String qrData = "http://localhost:8080/api/verify/"
                + credentialId;

        credential.setQrData(qrData);

        credential.setStatus(
                Credential.CredentialStatus.VALID);

        Credential savedCredential = credentialRepository.save(credential);

        return convertToDTO(savedCredential);
    }

    public CredentialDTO createCredential(Long documentId) {
        return createCredential(documentId, null);
    }

    public CredentialDTO getCredentialById(Long id) {

        Credential credential = credentialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Credential not found"));

        return convertToDTO(credential);
    }

    public CredentialDTO getCredentialByCredentialId(
            String credentialId) {

        Credential credential = credentialRepository.findByCredentialId(credentialId)
                .orElseThrow(() -> new RuntimeException(
                        "Credential not found"));

        return convertToDTO(credential);
    }

    public List<CredentialDTO> getAllCredentials() {

        return credentialRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public CredentialDTO revokeCredential(Long id) {

        Credential credential = credentialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Credential not found"));

        credential.setStatus(
                Credential.CredentialStatus.REVOKED);

        credential.setRevokedAt(
                java.time.LocalDateTime.now());

        Credential updatedCredential = credentialRepository.save(credential);

        return convertToDTO(updatedCredential);
    }

    private String generateCredentialId() {

        return "ZTC-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }

    private CredentialDTO convertToDTO(
            Credential credential) {

        CredentialDTO dto = new CredentialDTO(
                credential.getId(),
                credential.getCredentialId(),
                credential.getDocument().getId(),
                credential.getDigitalSignature(),
                credential.getQrData(),
                credential.getStatus(),
                credential.getIssuedAt(),
                credential.getExpiresAt(),
                credential.getRevokedAt());

        dto.setCredentialName(credential.getCredentialName());
        if (credential.getCreatedBy() != null) {
            dto.setCreatedBy(credential.getCreatedBy().getId());
        }

        return dto;
    }
}