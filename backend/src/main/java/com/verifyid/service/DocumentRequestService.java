package com.verifyid.service;

import com.verifyid.dto.CreateDocumentRequest;
import com.verifyid.entity.DocumentRequest;
import com.verifyid.entity.DocumentType;
import com.verifyid.entity.RequestStatus;
import com.verifyid.entity.User;
import com.verifyid.repository.DocumentRequestRepository;
import com.verifyid.repository.DocumentTypeRepository;
import com.verifyid.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentRequestService {

    private final DocumentRequestRepository requestRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final UserRepository userRepository;

    public DocumentRequestService(
            DocumentRequestRepository requestRepository,
            DocumentTypeRepository documentTypeRepository,
            UserRepository userRepository) {

        this.requestRepository = requestRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.userRepository = userRepository;
    }

    public DocumentRequest createRequest(
            Long studentId,
            CreateDocumentRequest request) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        DocumentType documentType =
                documentTypeRepository.findById(request.documentTypeId())
                        .orElseThrow(() ->
                                new RuntimeException("Document type not found"));

        if (!documentType.isActive()) {
            throw new RuntimeException("Document type is inactive");
        }

        DocumentRequest documentRequest = new DocumentRequest();

        documentRequest.setStudent(student);
        documentRequest.setDocumentType(documentType);
        documentRequest.setPurpose(request.purpose());
        documentRequest.setStatus(RequestStatus.SUBMITTED);

        return requestRepository.save(documentRequest);
    }

    public List<DocumentRequest> getStudentRequests(Long studentId) {
        return requestRepository.findByStudentId(studentId);
    }

    public List<DocumentRequest> getPendingRequests() {
        return requestRepository.findByStatus(RequestStatus.SUBMITTED);
    }
}