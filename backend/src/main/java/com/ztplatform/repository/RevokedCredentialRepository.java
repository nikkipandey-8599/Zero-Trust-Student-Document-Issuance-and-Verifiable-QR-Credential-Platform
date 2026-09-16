package com.ztplatform.repository;

import com.ztplatform.model.Credential;
import com.ztplatform.model.RevokedCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RevokedCredentialRepository extends JpaRepository<RevokedCredential, Long> {

    Optional<RevokedCredential> findByCredential(Credential credential);
}
