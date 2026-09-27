package com.verifyid.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.time.LocalDateTime;

@Entity
public class Credential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String credentialId;

   
    @OneToOne
@JoinColumn(name = "request_id", nullable = false)
private DocumentRequest request;

    private String documentHash;

    @Column(name = "signature", columnDefinition = "text")

    private String signature;

    private CredentialStatus status;

    private LocalDateTime issuedAt;

    private LocalDateTime expiresAt;

    @Column(name = "document_pdf", columnDefinition = "bytea")
private byte[] documentPdf;

    public Credential() {
    }

    public Long getId() {
        return id;
    }

    public String getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(String credentialId) {
        this.credentialId = credentialId;
    }

    public DocumentRequest getRequest() {
        return request;
    }

    public void setRequest(DocumentRequest request) {
        this.request = request;
    }

    public String getDocumentHash() {
        return documentHash;
    }

    public void setDocumentHash(String documentHash) {
        this.documentHash = documentHash;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public CredentialStatus getStatus() {
        return status;
    }

    public void setStatus(CredentialStatus status) {
        this.status = status;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public byte[] getDocumentPdf() {
        return documentPdf;
    }

    public void setDocumentPdf(byte[] documentPdf) {
        this.documentPdf = documentPdf;
    }

    @jakarta.persistence.PrePersist
    protected void onCreate() {
        if (issuedAt == null) {
            issuedAt = LocalDateTime.now();
        }
    }
}