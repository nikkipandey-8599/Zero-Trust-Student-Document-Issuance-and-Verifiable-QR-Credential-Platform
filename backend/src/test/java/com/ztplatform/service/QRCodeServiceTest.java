package com.ztplatform.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class QRCodeServiceTest {

    private QRCodeService qrCodeService;

    @BeforeEach
    void setUp() {
        qrCodeService = new QRCodeService();
    }

    @Test
    void generateQRCode_Success() {
        String data = "http://localhost:8080/api/verify/ZTC-ABC12345";

        byte[] qrCode = qrCodeService.generateQRCode(data);

        assertNotNull(qrCode);
        assertTrue(qrCode.length > 0);
    }

    @Test
    void generateQRCode_EmptyData() {
        String data = "";

        assertThrows(RuntimeException.class, () -> {
            qrCodeService.generateQRCode(data);
        });
    }

    @Test
    void generateQRCode_LongData() {
        String longData = "http://localhost:8080/api/verify/ZTC-ABC12345?param1=value1&param2=value2&param3=value3";

        byte[] qrCode = qrCodeService.generateQRCode(longData);

        assertNotNull(qrCode);
        assertTrue(qrCode.length > 0);
    }

    @Test
    void generateQRCode_VerificationURL() {
        String credentialId = "ZTC-ABC12345";
        String verificationURL = "http://localhost:8080/api/verify/" + credentialId;

        byte[] qrCode = qrCodeService.generateQRCode(verificationURL);

        assertNotNull(qrCode);
        assertTrue(qrCode.length > 0);
    }
}
