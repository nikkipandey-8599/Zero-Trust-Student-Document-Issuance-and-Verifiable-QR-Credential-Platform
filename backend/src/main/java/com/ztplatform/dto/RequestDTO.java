package com.ztplatform.dto;

import com.ztplatform.model.Document;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RequestDTO {

    private Long id;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Document type is required")
    private Document.DocumentType documentType;

    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason;

    private String status;

    @Size(max = 500, message = "Rejection reason must not exceed 500 characters")
    private String rejectionReason;

    private Long reviewedBy;

    public RequestDTO() {
    }

    public RequestDTO(
            Long id,
            Long studentId,
            Document.DocumentType documentType,
            String reason,
            String status,
            String rejectionReason,
            Long reviewedBy
    ) {
        this.id = id;
        this.studentId = studentId;
        this.documentType = documentType;
        this.reason = reason;
        this.status = status;
        this.rejectionReason = rejectionReason;
        this.reviewedBy = reviewedBy;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Document.DocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(Document.DocumentType documentType) {
        this.documentType = documentType;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Long getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(Long reviewedBy) {
        this.reviewedBy = reviewedBy;
    }
}