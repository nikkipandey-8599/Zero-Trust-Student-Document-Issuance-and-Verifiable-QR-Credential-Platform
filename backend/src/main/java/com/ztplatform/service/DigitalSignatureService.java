package com.ztplatform.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.*;
import java.util.Base64;

@Service
public class DigitalSignatureService {

    private final KeyPair keyPair;

    public DigitalSignatureService() {
        try {
            KeyPairGenerator keyPairGenerator =
                    KeyPairGenerator.getInstance("RSA");

            keyPairGenerator.initialize(2048);

            this.keyPair = keyPairGenerator.generateKeyPair();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(
                    "Unable to generate RSA key pair", e
            );
        }
    }

    public String sign(String data) {

        try {
            Signature signature =
                    Signature.getInstance("SHA256withRSA");

            signature.initSign(keyPair.getPrivate());

            signature.update(
                    data.getBytes(StandardCharsets.UTF_8)
            );

            byte[] signedData = signature.sign();

            return Base64.getEncoder()
                    .encodeToString(signedData);

        } catch (GeneralSecurityException e) {
            throw new RuntimeException(
                    "Unable to create digital signature", e
            );
        }
    }

    public boolean verify(
            String data,
            String digitalSignature
    ) {

        try {
            Signature signature =
                    Signature.getInstance("SHA256withRSA");

            signature.initVerify(keyPair.getPublic());

            signature.update(
                    data.getBytes(StandardCharsets.UTF_8)
            );

            byte[] signedData =
                    Base64.getDecoder()
                            .decode(digitalSignature);

            return signature.verify(signedData);

        } catch (GeneralSecurityException e) {
            return false;
        }
    }
}