package com.ztplatform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType documentType;

    @Column(nullable = false)
    private String title;

    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentStatus status;

    private LocalDateTime issuedAt;

    private LocalDateTime createdAt;

    public enum DocumentType {
        BONAFIDE_CERTIFICATE,
        MARKSHEET,
        DEGREE_CERTIFICATE,
        INTERNSHIP_CERTIFICATE,
        TRANSFER_CERTIFICATE
    }

    public enum DocumentStatus {
        DRAFT,
        ISSUED,
        REVOKED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}