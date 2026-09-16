package com.ztplatform.dto;

import java.time.LocalDateTime;

public class VerificationResponseDTO {

    private Boolean valid;
    private String status;
    private String credentialId;
    private String studentName;
    private String studentId;
    private String institution;
    private String documentType;
    private String title;
    private LocalDateTime issueDate;
    private LocalDateTime expiryDate;
    private LocalDateTime revokedDate;
    private String revocationReason;

    public VerificationResponseDTO() {
    }

    public VerificationResponseDTO(
            Boolean valid,
            String status,
            String credentialId,
            String studentName,
            String studentId,
            String institution,
            String documentType,
            String title,
            LocalDateTime issueDate
    ) {
        this.valid = valid;
        this.status = status;
        this.credentialId = credentialId;
        this.studentName = studentName;
        this.studentId = studentId;
        this.institution = institution;
        this.documentType = documentType;
        this.title = title;
        this.issueDate = issueDate;
    }

    public Boolean getValid() {
        return valid;
    }

    public void setValid(Boolean valid) {
        this.valid = valid;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(String credentialId) {
        this.credentialId = credentialId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDateTime issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public LocalDateTime getRevokedDate() {
        return revokedDate;
    }

    public void setRevokedDate(LocalDateTime revokedDate) {
        this.revokedDate = revokedDate;
    }

    public String getRevocationReason() {
        return revocationReason;
    }

    public void setRevocationReason(String revocationReason) {
        this.revocationReason = revocationReason;
    }
}