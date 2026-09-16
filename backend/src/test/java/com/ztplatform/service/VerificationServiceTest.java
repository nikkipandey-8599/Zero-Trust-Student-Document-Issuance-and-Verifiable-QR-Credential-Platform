package com.ztplatform.service;

import com.ztplatform.config.AppConfig.InstitutionProperties;
import com.ztplatform.dto.VerificationResponseDTO;
import com.ztplatform.model.Credential;
import com.ztplatform.model.Document;
import com.ztplatform.model.Student;
import com.ztplatform.model.User;
import com.ztplatform.repository.CredentialRepository;
import com.ztplatform.repository.RevokedCredentialRepository;
import com.ztplatform.repository.VerificationLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VerificationServiceTest {

    @Mock
    private CredentialRepository credentialRepository;

    @Mock
    private DigitalSignatureService digitalSignatureService;

    @Mock
    private VerificationLogRepository verificationLogRepository;

    @Mock
    private RevokedCredentialRepository revokedCredentialRepository;

    @Mock
    private InstitutionProperties institutionProperties;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private VerificationService verificationService;

    private Credential testCredential;
    private Student testStudent;
    private Document testDocument;

    @BeforeEach
    void setUp() {
        testStudent = new Student();
        testStudent.setId(1L);
        testStudent.setStudentId("STU001");

        User testUser = new User();
        testUser.setId(1L);
        testUser.setName("Test Student");
        testStudent.setUser(testUser);

        testDocument = new Document();
        testDocument.setId(1L);
        testDocument.setStudent(testStudent);
        testDocument.setDocumentType(Document.DocumentType.BONAFIDE_CERTIFICATE);
        testDocument.setTitle("Bonafide Certificate");

        testCredential = new Credential();
        testCredential.setId(1L);
        testCredential.setCredentialId("ZTC-ABC12345");
        testCredential.setDocument(testDocument);
        testCredential.setDigitalSignature("test-signature");
        testCredential.setStatus(Credential.CredentialStatus.ACTIVE);
        testCredential.setIssuedAt(LocalDateTime.now());

        lenient().when(institutionProperties.getName()).thenReturn("Test Institution");
    }

    @Test
    void verifyCredential_Valid() {
        when(credentialRepository.findByCredentialId(anyString())).thenReturn(Optional.of(testCredential));
        when(digitalSignatureService.verify(anyString(), anyString())).thenReturn(true);
        when(request.getHeader("User-Agent")).thenReturn("Test Agent");
        when(request.getHeader("X-Forwarded-For")).thenReturn("127.0.0.1");

        VerificationResponseDTO response = verificationService.verifyCredential("ZTC-ABC12345", request);

        assertNotNull(response);
        assertTrue(response.getValid());
        assertEquals("ACTIVE", response.getStatus());
    }

    @Test
    void verifyCredential_Revoked() {
        testCredential.setStatus(Credential.CredentialStatus.REVOKED);
        when(credentialRepository.findByCredentialId(anyString())).thenReturn(Optional.of(testCredential));
        when(request.getHeader("User-Agent")).thenReturn("Test Agent");
        when(request.getHeader("X-Forwarded-For")).thenReturn("127.0.0.1");

        VerificationResponseDTO response = verificationService.verifyCredential("ZTC-ABC12345", request);

        assertNotNull(response);
        assertFalse(response.getValid());
        assertEquals("REVOKED", response.getStatus());
    }

    @Test
    void verifyCredential_Expired() {
        testCredential.setExpiresAt(LocalDateTime.now().minusDays(1));
        testCredential.setStatus(Credential.CredentialStatus.ACTIVE);
        when(credentialRepository.findByCredentialId(anyString())).thenReturn(Optional.of(testCredential));
        when(request.getHeader("User-Agent")).thenReturn("Test Agent");
        when(request.getHeader("X-Forwarded-For")).thenReturn("127.0.0.1");

        VerificationResponseDTO response = verificationService.verifyCredential("ZTC-ABC12345", request);

        assertNotNull(response);
        assertFalse(response.getValid());
        assertEquals("EXPIRED", response.getStatus());
    }

    @Test
    void verifyCredential_InvalidSignature() {
        when(credentialRepository.findByCredentialId(anyString())).thenReturn(Optional.of(testCredential));
        when(digitalSignatureService.verify(anyString(), anyString())).thenReturn(false);
        when(request.getHeader("User-Agent")).thenReturn("Test Agent");
        when(request.getHeader("X-Forwarded-For")).thenReturn("127.0.0.1");

        VerificationResponseDTO response = verificationService.verifyCredential("ZTC-ABC12345", request);

        assertNotNull(response);
        assertFalse(response.getValid());
        assertEquals("INVALID", response.getStatus());
    }

    @Test
    void verifyCredential_NotFound() {
        when(credentialRepository.findByCredentialId(anyString())).thenReturn(Optional.empty());

        VerificationResponseDTO response = verificationService.verifyCredential("NONEXISTENT", request);

        assertNotNull(response);
        assertFalse(response.getValid());
        assertEquals("NOT_FOUND", response.getStatus());
    }
}
