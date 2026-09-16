package com.ztplatform.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DigitalSignatureServiceTest {

    private DigitalSignatureService digitalSignatureService;

    @BeforeEach
    void setUp() {
        digitalSignatureService = new DigitalSignatureService();
    }

    @Test
    void sign_Success() {
        String data = "test-data-to-sign";

        String signature = digitalSignatureService.sign(data);

        assertNotNull(signature);
        assertFalse(signature.isEmpty());
    }

    @Test
    void verify_ValidSignature() {
        String data = "test-data-to-verify";
        String signature = digitalSignatureService.sign(data);

        boolean isValid = digitalSignatureService.verify(data, signature);

        assertTrue(isValid);
    }

    @Test
    void verify_InvalidSignature() {
        String data = "test-data-to-verify";
        String signature = digitalSignatureService.sign(data);
        String tamperedData = "tampered-data";

        boolean isValid = digitalSignatureService.verify(tamperedData, signature);

        assertFalse(isValid);
    }

    @Test
    void verify_WrongSignature() {
        String data = "test-data-to-verify";
        // Valid Base64 but cryptographically wrong signature
        String wrongSignature = java.util.Base64.getEncoder().encodeToString("invalid-signature-data".getBytes());

        boolean isValid = digitalSignatureService.verify(data, wrongSignature);

        assertFalse(isValid);
    }

    @Test
    void signAndVerify_CompleteFlow() {
        String originalData = "credential-id|document-id|student-id|document-type|title";

        String signature = digitalSignatureService.sign(originalData);
        boolean isValid = digitalSignatureService.verify(originalData, signature);

        assertTrue(isValid);
    }
}
