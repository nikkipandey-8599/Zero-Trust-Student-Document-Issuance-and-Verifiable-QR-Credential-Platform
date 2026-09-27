package com.verifyid.controller;

import com.verifyid.service.QrCodeService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/qr")
public class QrCodeController {

    private final QrCodeService qrCodeService;

    public QrCodeController(QrCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    @GetMapping("/{credentialId}")
    public ResponseEntity<Map<String, String>> generateQr(
            @PathVariable String credentialId
    ) {

        String qrBase64 =
                qrCodeService.generateVerificationQr(
                        credentialId
                );

        return ResponseEntity.ok(
                Map.of(
                        "credentialId", credentialId,
                        "qrCode", qrBase64
                )
        );
    }
}