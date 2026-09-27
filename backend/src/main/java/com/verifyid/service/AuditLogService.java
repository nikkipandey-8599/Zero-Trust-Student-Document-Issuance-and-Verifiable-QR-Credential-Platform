package com.verifyid.service;

import com.verifyid.entity.AuditLog;
import com.verifyid.entity.User;
import com.verifyid.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final HttpServletRequest httpServletRequest;

    public AuditLogService(
            AuditLogRepository auditLogRepository,
            HttpServletRequest httpServletRequest
    ) {
        this.auditLogRepository = auditLogRepository;
        this.httpServletRequest = httpServletRequest;
    }

    public void log(
            Long userId,
            String action,
            String resourceType,
            Long resourceId,
            String details
    ) {

        AuditLog auditLog = new AuditLog();

        auditLog.setUserId(userId);
        auditLog.setAction(action);
        auditLog.setResourceType(resourceType);
        auditLog.setResourceId(resourceId);
        auditLog.setIpAddress(getClientIp());
        auditLog.setDetails(details);

        auditLogRepository.save(auditLog);
    }

    public void logCurrentUser(
            String action,
            String resourceType,
            Long resourceId,
            String details
    ) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                authentication.getPrincipal() == null) {

            throw new RuntimeException(
                    "Authenticated user not found"
            );
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User)) {

            throw new RuntimeException(
                    "Authenticated principal is not a VerifyID user"
            );
        }

        User user = (User) principal;

        log(
                user.getId(),
                action,
                resourceType,
                resourceId,
                details
        );
    }

    private String getClientIp() {

        String forwarded =
                httpServletRequest.getHeader("X-Forwarded-For");

        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }

        String realIp =
                httpServletRequest.getHeader("X-Real-IP");

        if (realIp != null && !realIp.isBlank()) {
            return realIp;
        }

        return httpServletRequest.getRemoteAddr();
    }
}