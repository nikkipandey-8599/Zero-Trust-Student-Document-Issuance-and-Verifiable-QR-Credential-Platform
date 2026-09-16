package com.ztplatform.service;

import com.ztplatform.model.AuditLog;
import com.ztplatform.model.User;
import com.ztplatform.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public AuditLog log(
            User user,
            String action,
            String entityType,
            Long entityId,
            String ipAddress,
            String details
    ) {
        AuditLog auditLog = new AuditLog();

        auditLog.setUser(user);
        auditLog.setAction(action);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setIpAddress(ipAddress);
        auditLog.setDetails(details);

        return auditLogRepository.save(auditLog);
    }
}