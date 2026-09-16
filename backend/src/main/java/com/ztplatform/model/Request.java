package com.ztplatform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Document.DocumentType documentType;

    @Column(length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    @ManyToOne
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    private String rejectionReason;

    @Column(nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    private LocalDateTime reviewedAt;

    @PrePersist
    protected void onCreate() {
        requestedAt = LocalDateTime.now();

        if (status == null) {
            status = RequestStatus.PENDING;
        }
    }

    public enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}