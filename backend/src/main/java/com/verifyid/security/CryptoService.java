package com.verifyid.security;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Service
public class CryptoService {

    private static final String ALGORITHM = "RSA";
    private static final String SIGNATURE_ALGORITHM = "SHA256withRSA";

    private final PrivateKey privateKey;
    private final PublicKey publicKey;

    private static final Path KEY_DIRECTORY =
            Paths.get("keys");

    private static final Path PRIVATE_KEY_FILE =
            KEY_DIRECTORY.resolve("verifyid-private.key");

    private static final Path PUBLIC_KEY_FILE =
            KEY_DIRECTORY.resolve("verifyid-public.key");

    public CryptoService() {
        try {
            Files.createDirectories(KEY_DIRECTORY);

            if (Files.exists(PRIVATE_KEY_FILE)
                    && Files.exists(PUBLIC_KEY_FILE)) {

                this.privateKey = loadPrivateKey();
                this.publicKey = loadPublicKey();

                System.out.println(
                        "VerifyID RSA keys loaded from persistent storage."
                );

            } else {

                KeyPair keyPair = generateKeyPair();

                this.privateKey = keyPair.getPrivate();
                this.publicKey = keyPair.getPublic();

                saveKeys(keyPair);

                System.out.println(
                        "VerifyID RSA keys generated and saved."
                );
            }

        } catch (Exception e) {
            throw new RuntimeException(
                    "Unable to initialize VerifyID cryptographic keys",
                    e
            );
        }
    }

    private KeyPair generateKeyPair() throws Exception {

        KeyPairGenerator generator =
                KeyPairGenerator.getInstance(ALGORITHM);

        generator.initialize(2048);

        return generator.generateKeyPair();
    }

    public String sign(String data) {

        try {

            Signature signature =
                    Signature.getInstance(SIGNATURE_ALGORITHM);

            signature.initSign(privateKey);

            signature.update(
                    data.getBytes(StandardCharsets.UTF_8)
            );

            byte[] signedBytes =
                    signature.sign();

            return Base64.getEncoder()
                    .encodeToString(signedBytes);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to sign credential",
                    e
            );
        }
    }

    public boolean verify(
            String data,
            String signatureValue
    ) {

        try {

            Signature signature =
                    Signature.getInstance(SIGNATURE_ALGORITHM);

            signature.initVerify(publicKey);

            signature.update(
                    data.getBytes(StandardCharsets.UTF_8)
            );

            byte[] signatureBytes =
                    Base64.getDecoder()
                            .decode(signatureValue);

            return signature.verify(signatureBytes);

        } catch (Exception e) {

            return false;
        }
    }

    private void saveKeys(KeyPair keyPair)
            throws Exception {

        Files.write(
                PRIVATE_KEY_FILE,
                Base64.getEncoder()
                        .encode(
                                keyPair
                                        .getPrivate()
                                        .getEncoded()
                        )
        );

        Files.write(
                PUBLIC_KEY_FILE,
                Base64.getEncoder()
                        .encode(
                                keyPair
                                        .getPublic()
                                        .getEncoded()
                        )
        );
    }

    private PrivateKey loadPrivateKey()
            throws Exception {

        byte[] encoded =
                Base64.getDecoder().decode(
                        Files.readAllBytes(
                                PRIVATE_KEY_FILE
                        )
                );

        PKCS8EncodedKeySpec keySpec =
                new PKCS8EncodedKeySpec(encoded);

        KeyFactory keyFactory =
                KeyFactory.getInstance(ALGORITHM);

        return keyFactory.generatePrivate(keySpec);
    }

    private PublicKey loadPublicKey()
            throws Exception {

        byte[] encoded =
                Base64.getDecoder().decode(
                        Files.readAllBytes(
                                PUBLIC_KEY_FILE
                        )
                );

        X509EncodedKeySpec keySpec =
                new X509EncodedKeySpec(encoded);

        KeyFactory keyFactory =
                KeyFactory.getInstance(ALGORITHM);

        return keyFactory.generatePublic(keySpec);
    }
}