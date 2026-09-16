package com.ztplatform.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "credential_id")
    private Credential credential;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerifierType verifierType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationMethod verificationMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationResult result;

    @Column(nullable = false, updatable = false)
    private LocalDateTime verifiedAt;

    @Size(max = 45, message = "IP address must not exceed 45 characters")
    private String ipAddress;

    @Size(max = 500, message = "User agent must not exceed 500 characters")
    @Column(columnDefinition = "TEXT")
    private String userAgent;

    @PrePersist
    protected void onCreate() {
        verifiedAt = LocalDateTime.now();
    }

    public enum VerifierType {
        PUBLIC,
        STUDENT,
        ADMIN,
        VERIFIER
    }

    public enum VerificationMethod {
        QR,
        CREDENTIAL_ID
    }

    public enum VerificationResult {
        VALID,
        INVALID,
        REVOKED,
        EXPIRED,
        NOT_FOUND
    }
}
