package com.verifyid.repository;

import com.verifyid.entity.Credential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CredentialRepository
        extends JpaRepository<Credential, Long> {

    Optional<Credential> findByCredentialId(String credentialId);

    Optional<Credential> findByRequestId(Long requestId);
}