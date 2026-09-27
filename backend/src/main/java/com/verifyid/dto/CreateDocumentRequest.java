package com.verifyid.dto;

public record CreateDocumentRequest(
        Long documentTypeId,
        String purpose
) {
}