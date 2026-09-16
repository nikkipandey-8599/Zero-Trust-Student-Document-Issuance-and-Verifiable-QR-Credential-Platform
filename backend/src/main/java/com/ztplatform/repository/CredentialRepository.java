package com.ztplatform.repository;

import com.ztplatform.model.Credential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CredentialRepository extends JpaRepository<Credential, Long> {

    Optional<Credential> findByCredentialId(String credentialId);

    boolean existsByCredentialId(String credentialId);

    Optional<Credential> findByDocumentId(Long documentId);
}