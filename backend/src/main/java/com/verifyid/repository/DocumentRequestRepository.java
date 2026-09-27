package com.verifyid.repository;

import com.verifyid.entity.DocumentRequest;
import com.verifyid.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRequestRepository
        extends JpaRepository<DocumentRequest, Long> {

    List<DocumentRequest> findByStudentId(Long studentId);

    List<DocumentRequest> findByStatus(RequestStatus status);

}