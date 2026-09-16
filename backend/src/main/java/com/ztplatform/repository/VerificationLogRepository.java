package com.ztplatform.repository;

import com.ztplatform.model.Credential;
import com.ztplatform.model.VerificationLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface VerificationLogRepository extends JpaRepository<VerificationLog, Long> {

    List<VerificationLog> findByCredential(Credential credential);

    List<VerificationLog> findByVerifiedAtBetween(LocalDateTime start, LocalDateTime end);

    List<VerificationLog> findByResult(VerificationLog.VerificationResult result);
}
