package com.ztplatform.repository;

import com.ztplatform.model.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentTypeRepository extends JpaRepository<DocumentType, Long> {

    Optional<DocumentType> findByName(String name);

    List<DocumentType> findByIsActiveTrue();

    boolean existsByName(String name);
}
