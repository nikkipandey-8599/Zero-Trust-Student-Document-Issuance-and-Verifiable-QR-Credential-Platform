package com.verifyid.repository;

import com.verifyid.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {

    List<AuditLog>
    findByResourceTypeAndResourceIdOrderByCreatedAtDesc(
            String resourceType,
            Long resourceId
    );

    List<AuditLog> findAllByOrderByCreatedAtDesc();
}