package com.verifyid.controller;

import com.verifyid.entity.DocumentType;
import com.verifyid.repository.DocumentTypeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentTypeRepository documentTypeRepository;

    public DocumentController(DocumentTypeRepository documentTypeRepository) {
        this.documentTypeRepository = documentTypeRepository;
    }

    @GetMapping("/types")
    public List<DocumentType> getDocumentTypes() {
        return documentTypeRepository.findByActiveTrue();
    }
}