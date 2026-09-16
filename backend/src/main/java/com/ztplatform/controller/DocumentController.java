package com.ztplatform.controller;

import com.ztplatform.dto.DocumentDTO;
import com.ztplatform.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping
    public ResponseEntity<List<DocumentDTO>> getAllDocuments() {
        return ResponseEntity.ok(
                documentService.getAllDocuments()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentDTO> getDocumentById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                documentService.getDocumentById(id)
        );
    }

    @PostMapping
    public ResponseEntity<DocumentDTO> createDocument(
            @RequestBody DocumentDTO documentDTO
    ) {
        return ResponseEntity.ok(
                documentService.createDocument(documentDTO)
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByStudent(
            @PathVariable Long studentId
    ) {
        return ResponseEntity.ok(
                documentService.getDocumentsByStudent(studentId)
        );
    }

    @PutMapping("/{id}/revoke")
    public ResponseEntity<DocumentDTO> revokeDocument(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                documentService.revokeDocument(id)
        );
    }
}