package com.ztplatform.dto;

import com.ztplatform.model.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class DocumentDTO {

    private Long id;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Document type is required")
    private Document.DocumentType documentType;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 500, message = "File URL must not exceed 500 characters")
    private String fileUrl;

    private Document.DocumentStatus status;

    public DocumentDTO() {
    }

    public DocumentDTO(
            Long id,
            Long studentId,
            Document.DocumentType documentType,
            String title,
            String fileUrl,
            Document.DocumentStatus status
    ) {
        this.id = id;
        this.studentId = studentId;
        this.documentType = documentType;
        this.title = title;
        this.fileUrl = fileUrl;
        this.status = status;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public Document.DocumentStatus getStatus() {
        return status;
    }

    public void setStatus(Document.DocumentStatus status) {
        this.status = status;
    }
}