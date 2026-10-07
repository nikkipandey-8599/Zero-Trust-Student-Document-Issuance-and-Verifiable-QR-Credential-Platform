package com.verifyid.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
public class QrCodeService {

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public byte[] generateVerificationQrBytes(String credentialId) {

        try {

            String verificationUrl =
                    frontendUrl.replaceAll("/+$", "")
                            + "/verify/" + credentialId;

            QRCodeWriter qrCodeWriter =
                    new QRCodeWriter();

            BitMatrix bitMatrix =
                    qrCodeWriter.encode(
                            verificationUrl,
                            BarcodeFormat.QR_CODE,
                            400,
                            400
                    );

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();

            MatrixToImageWriter.writeToStream(
                    bitMatrix,
                    "PNG",
                    outputStream
            );

            return outputStream.toByteArray();

        } catch (WriterException | IOException e) {

            throw new RuntimeException(
                    "Unable to generate QR code",
                    e
            );
        }
    }

    public String generateVerificationQr(String credentialId) {

        return Base64.getEncoder().encodeToString(
                generateVerificationQrBytes(credentialId)
        );
    }
}