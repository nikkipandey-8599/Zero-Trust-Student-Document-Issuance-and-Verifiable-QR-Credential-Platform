package com.ztplatform.service;

import com.ztplatform.dto.RequestDTO;
import com.ztplatform.model.Document;
import com.ztplatform.model.Request;
import com.ztplatform.model.Student;
import com.ztplatform.model.User;
import com.ztplatform.repository.DocumentRepository;
import com.ztplatform.repository.RequestRepository;
import com.ztplatform.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final RequestRepository requestRepository;
    private final StudentRepository studentRepository;
    private final DocumentRepository documentRepository;
    private final CredentialService credentialService;

    public RequestDTO createRequest(RequestDTO dto) {

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        Request request = new Request();

        request.setStudent(student);
        request.setDocumentType(dto.getDocumentType());
        request.setReason(dto.getReason());
        request.setStatus(Request.RequestStatus.PENDING);

        Request savedRequest = requestRepository.save(request);

        return convertToDTO(savedRequest);
    }

    public List<RequestDTO> getAllRequests() {

        return requestRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<RequestDTO> getRequestsByStudent(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        return requestRepository.findByStudent(student)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public RequestDTO getRequestById(Long id) {

        Request request = requestRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Request not found"));

        return convertToDTO(request);
    }

    @Transactional
    public RequestDTO approveRequest(Long id, User admin) {

        Request request = requestRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Request not found"));

        // Only pending requests can be approved
        if (request.getStatus() != Request.RequestStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending requests can be approved"
            );
        }

        // Mark request as approved
        request.setStatus(Request.RequestStatus.APPROVED);
        request.setReviewedBy(admin);
        request.setReviewedAt(LocalDateTime.now());
        request.setRejectionReason(null);

        Request updatedRequest = requestRepository.save(request);

        // Create document for the approved request
        Document document = new Document();

        document.setStudent(request.getStudent());
        document.setDocumentType(request.getDocumentType());
        document.setTitle(generateDocumentTitle(
                request.getDocumentType()
        ));
        document.setStatus(Document.DocumentStatus.ISSUED);
        document.setIssuedAt(LocalDateTime.now());

        Document savedDocument = documentRepository.save(document);

        // Generate credential automatically
        credentialService.createCredential(savedDocument.getId(), admin);

        return convertToDTO(updatedRequest);
    }

    public RequestDTO rejectRequest(
            Long id,
            User admin,
            String rejectionReason
    ) {

        Request request = requestRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Request not found"));

        // Only pending requests can be rejected
        if (request.getStatus() != Request.RequestStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending requests can be rejected"
            );
        }

        request.setStatus(Request.RequestStatus.REJECTED);
        request.setReviewedBy(admin);
        request.setReviewedAt(LocalDateTime.now());
        request.setRejectionReason(rejectionReason);

        Request updatedRequest = requestRepository.save(request);

        return convertToDTO(updatedRequest);
    }

    private String generateDocumentTitle(
            Document.DocumentType documentType
    ) {

        return switch (documentType) {

            case BONAFIDE_CERTIFICATE ->
                    "Bonafide Certificate";

            case MARKSHEET ->
                    "Marksheet";

            case DEGREE_CERTIFICATE ->
                    "Degree Certificate";

            case INTERNSHIP_CERTIFICATE ->
                    "Internship Certificate";

            case TRANSFER_CERTIFICATE ->
                    "Transfer Certificate";
        };
    }

    private RequestDTO convertToDTO(Request request) {

        Long reviewedById = null;

        if (request.getReviewedBy() != null) {
            reviewedById = request.getReviewedBy().getId();
        }

        return new RequestDTO(
                request.getId(),
                request.getStudent().getId(),
                request.getDocumentType(),
                request.getReason(),
                request.getStatus().name(),
                request.getRejectionReason(),
                reviewedById
        );
    }
}