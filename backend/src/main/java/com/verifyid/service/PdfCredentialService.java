package com.verifyid.service;

import com.verifyid.entity.Credential;
import com.verifyid.entity.DocumentRequest;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class PdfCredentialService {

    public byte[] generateCredentialPdf(
            Credential credential,
            DocumentRequest request
    ) {

        String studentName =
                request.getStudent().getFullName();

        String documentType =
                request.getDocumentType().getName();

        String purpose =
                request.getPurpose();

        String pdfContent =
                "VERIFYID - DIGITAL ACADEMIC CREDENTIAL\n"
                + "========================================\n\n"
                + "Document Type: " + documentType + "\n"
                + "Student: " + studentName + "\n"
                + "Credential ID: " + credential.getCredentialId() + "\n"
                + "Purpose: " + purpose + "\n"
                + "Status: ACTIVE\n"
                + "Issued: " + credential.getIssuedAt() + "\n"
                + "Expires: " + credential.getExpiresAt() + "\n\n"
                + "This credential is digitally signed by VerifyID.\n"
                + "The credential can be independently verified\n"
                + "using the VerifyID verification service.\n";

        return createSimplePdf(pdfContent);
    }

    private byte[] createSimplePdf(String text) {

        String escapedText = text
                .replace("\\", "\\\\")
                .replace("(", "\\(")
                .replace(")", "\\)");

        String[] lines = escapedText.split("\n");

        StringBuilder stream = new StringBuilder();

        stream.append("BT\n");
        stream.append("/F1 11 Tf\n");
        stream.append("50 750 Td\n");

        for (String line : lines) {
            stream.append("(")
                    .append(line)
                    .append(") Tj\n");

            stream.append("0 -16 Td\n");
        }

        stream.append("ET\n");

        byte[] streamBytes =
                stream.toString()
                        .getBytes(StandardCharsets.US_ASCII);

        StringBuilder pdf = new StringBuilder();

        pdf.append("%PDF-1.4\n");

        // FIX: need indexes 0 through 5
        int[] offsets = new int[6];

        offsets[1] = pdf.length();
        pdf.append("1 0 obj\n");
        pdf.append("<< /Type /Catalog /Pages 2 0 R >>\n");
        pdf.append("endobj\n");

        offsets[2] = pdf.length();
        pdf.append("2 0 obj\n");
        pdf.append("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n");
        pdf.append("endobj\n");

        offsets[3] = pdf.length();
        pdf.append("3 0 obj\n");
        pdf.append("<< /Type /Page ");
        pdf.append("/Parent 2 0 R ");
        pdf.append("/MediaBox [0 0 595 842] ");
        pdf.append("/Resources << /Font << /F1 4 0 R >> >> ");
        pdf.append("/Contents 5 0 R >>\n");
        pdf.append("endobj\n");

        offsets[4] = pdf.length();
        pdf.append("4 0 obj\n");
        pdf.append("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n");
        pdf.append("endobj\n");

        offsets[5] = pdf.length();
        pdf.append("5 0 obj\n");
        pdf.append("<< /Length ")
                .append(streamBytes.length)
                .append(" >>\n");
        pdf.append("stream\n");
        pdf.append(stream.toString());
        pdf.append("endstream\n");
        pdf.append("endobj\n");

        int xrefPosition = pdf.length();

        pdf.append("xref\n");
        pdf.append("0 6\n");
        pdf.append("0000000000 65535 f \n");

        for (int i = 1; i <= 5; i++) {
            pdf.append(
                    String.format(
                            "%010d 00000 n \n",
                            offsets[i]
                    )
            );
        }

        pdf.append("trailer\n");
        pdf.append("<< /Size 6 /Root 1 0 R >>\n");
        pdf.append("startxref\n");
        pdf.append(xrefPosition)
                .append("\n");
        pdf.append("%%EOF");

        return pdf.toString()
                .getBytes(StandardCharsets.US_ASCII);
    }
}