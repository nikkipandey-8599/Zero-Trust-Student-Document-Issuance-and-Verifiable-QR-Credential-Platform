package com.ztplatform.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "revoked_credentials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevokedCredential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "credential_id", nullable = false, unique = true)
    private Credential credential;

    @ManyToOne
    @JoinColumn(name = "revoked_by")
    private User revokedBy;

    @NotBlank(message = "Revocation reason is required")
    @Size(max = 500, message = "Revocation reason must not exceed 500 characters")
    @Column(nullable = false)
    private String reason;

    @Column(nullable = false, updatable = false)
    private LocalDateTime revokedAt;

    @Size(max = 1000, message = "Remarks must not exceed 1000 characters")
    @Column(columnDefinition = "TEXT")
    private String remarks;

    @PrePersist
    protected void onCreate() {
        revokedAt = LocalDateTime.now();
    }
}
