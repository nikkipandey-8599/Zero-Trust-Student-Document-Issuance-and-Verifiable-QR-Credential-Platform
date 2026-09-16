package com.ztplatform.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "credentials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Credential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Credential ID is required")
    @Size(max = 50, message = "Credential ID must not exceed 50 characters")
    @Column(nullable = false, unique = true)
    private String credentialId;

    @OneToOne
    @JoinColumn(name = "document_id", nullable = false, unique = true)
    private Document document;

    @NotBlank(message = "Credential name is required")
    @Size(max = 200, message = "Credential name must not exceed 200 characters")
    @Column(nullable = false)
    private String credentialName;

    @NotBlank(message = "Digital signature is required")
    @Size(max = 1000, message = "Digital signature must not exceed 1000 characters")
    @Column(nullable = false, length = 1000)
    private String digitalSignature;

    @NotBlank(message = "QR data is required")
    @Size(max = 2000, message = "QR data must not exceed 2000 characters")
    @Column(nullable = false, length = 2000)
    private String qrData;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CredentialStatus status;

    @NotNull(message = "Issue date is required")
    @Column(nullable = false)
    private LocalDateTime issuedAt;

    private LocalDateTime expiresAt;

    private LocalDateTime revokedAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        issuedAt = LocalDateTime.now();

        if (status == null) {
            status = CredentialStatus.VALID;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum CredentialStatus {
        DRAFT,
        ISSUED,
        ACTIVE,
        VALID,
        REVOKED,
        EXPIRED
    }
}