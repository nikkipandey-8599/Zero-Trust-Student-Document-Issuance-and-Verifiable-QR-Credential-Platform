package com.ztplatform.controller;

import com.ztplatform.dto.CredentialDTO;
import com.ztplatform.model.Credential;
import com.ztplatform.service.CredentialService;
import com.ztplatform.service.PDFService;
import com.ztplatform.service.QRCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credentials")
@RequiredArgsConstructor
public class CredentialController {

    private final CredentialService credentialService;
    private final QRCodeService qrCodeService;
    private final PDFService pdfService;

    @PostMapping("/document/{documentId}")
    public ResponseEntity<CredentialDTO> createCredential(
            @PathVariable Long documentId
    ) {
        return ResponseEntity.ok(
                credentialService.createCredential(documentId)
        );
    }

    @GetMapping
    public ResponseEntity<List<CredentialDTO>> getAllCredentials() {
        return ResponseEntity.ok(
                credentialService.getAllCredentials()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CredentialDTO> getCredentialById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                credentialService.getCredentialById(id)
        );
    }

    @GetMapping("/verify/{credentialId}")
    public ResponseEntity<CredentialDTO> getCredentialByCredentialId(
            @PathVariable String credentialId
    ) {
        return ResponseEntity.ok(
                credentialService.getCredentialByCredentialId(credentialId)
        );
    }

    // Generate and return actual QR code PNG
    @GetMapping(
            value = "/{credentialId}/qr",
            produces = MediaType.IMAGE_PNG_VALUE
    )
    public ResponseEntity<byte[]> getQRCode(
            @PathVariable String credentialId
    ) {

        CredentialDTO credential =
                credentialService.getCredentialByCredentialId(credentialId);

        byte[] qrCode =
                qrCodeService.generateQRCode(
                        credential.getQrData()
                );

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qrCode);
    }

    // Generate and download certificate PDF
    @GetMapping(
            value = "/{credentialId}/pdf",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public ResponseEntity<byte[]> getCertificatePDF(
            @PathVariable String credentialId
    ) {

        Credential credential =
                credentialService.getCredentialEntityByCredentialId(
                        credentialId
                );

        byte[] pdf =
                pdfService.generateCertificate(credential);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\""
                                + credentialId
                                + ".pdf\""
                )
                .body(pdf);
    }

    @PutMapping("/{id}/revoke")
    public ResponseEntity<CredentialDTO> revokeCredential(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                credentialService.revokeCredential(id)
        );
    }
}