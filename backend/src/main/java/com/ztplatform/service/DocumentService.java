package com.ztplatform.service;

import com.ztplatform.dto.DocumentDTO;
import com.ztplatform.model.Document;
import com.ztplatform.model.Student;
import com.ztplatform.repository.DocumentRepository;
import com.ztplatform.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final StudentRepository studentRepository;

    public DocumentDTO createDocument(DocumentDTO dto) {

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        Document document = new Document();

        document.setStudent(student);
        document.setDocumentType(dto.getDocumentType());
        document.setTitle(dto.getTitle());
        document.setFileUrl(dto.getFileUrl());

        if (dto.getStatus() != null) {
            document.setStatus(dto.getStatus());
        } else {
            document.setStatus(Document.DocumentStatus.DRAFT);
        }

        Document savedDocument = documentRepository.save(document);

        return convertToDTO(savedDocument);
    }

    public List<DocumentDTO> getAllDocuments() {

        return documentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public DocumentDTO getDocumentById(Long id) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Document not found"));

        return convertToDTO(document);
    }

    public List<DocumentDTO> getDocumentsByStudent(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        return documentRepository.findByStudent(student)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public DocumentDTO revokeDocument(Long id) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Document not found"));

        document.setStatus(Document.DocumentStatus.REVOKED);

        Document updatedDocument = documentRepository.save(document);

        return convertToDTO(updatedDocument);
    }

    private DocumentDTO convertToDTO(Document document) {

        return new DocumentDTO(
                document.getId(),
                document.getStudent().getId(),
                document.getDocumentType(),
                document.getTitle(),
                document.getFileUrl(),
                document.getStatus()
        );
    }
}