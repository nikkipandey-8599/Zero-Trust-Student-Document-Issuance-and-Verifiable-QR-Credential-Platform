package com.ztplatform.service;

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import com.ztplatform.model.Credential;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PDFService {

    private final QRCodeService qrCodeService;

    public PDFService(QRCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    public byte[] generateCertificate(Credential credential) {

        try {

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();

            PdfWriter writer =
                    new PdfWriter(outputStream);

            PdfDocument pdf =
                    new PdfDocument(writer);

            Document document =
                    new Document(pdf);

            // College heading
            Paragraph heading =
                    new Paragraph("STUDENT DIGITAL CREDENTIAL")
                            .setBold()
                            .setFontSize(22)
                            .setTextAlignment(TextAlignment.CENTER);

            document.add(heading);

            document.add(new Paragraph("\n"));

            // Certificate title
            Paragraph title =
                    new Paragraph(
                            credential.getDocument().getTitle()
                    )
                    .setBold()
                    .setFontSize(18)
                    .setTextAlignment(TextAlignment.CENTER);

            document.add(title);

            document.add(new Paragraph("\n"));

            // Student details
            document.add(
                    new Paragraph(
                            "Student ID: " +
                            credential.getDocument()
                                    .getStudent()
                                    .getStudentId()
                    )
            );

            document.add(
                    new Paragraph(
                            "Document Type: " +
                            credential.getDocument()
                                    .getDocumentType()
                                    .name()
                    )
            );

            document.add(
                    new Paragraph(
                            "Credential ID: " +
                            credential.getCredentialId()
                    )
            );

            document.add(
                    new Paragraph(
                            "Issued At: " +
                            credential.getIssuedAt()
                    )
            );

            document.add(
                    new Paragraph(
                            "Status: " +
                            credential.getStatus().name()
                    )
            );

            document.add(new Paragraph("\n"));

            // Generate QR Code
            byte[] qrCodeBytes =
                    qrCodeService.generateQRCode(
                            credential.getQrData()
                    );

            // Convert QR bytes into iText image
            ImageData imageData =
                    ImageDataFactory.create(qrCodeBytes);

            Image qrImage =
                    new Image(imageData);

            qrImage.setWidth(180);
            qrImage.setHeight(180);
            qrImage.setHorizontalAlignment(
                    com.itextpdf.layout.properties.HorizontalAlignment.CENTER
            );

            document.add(qrImage);

            document.add(new Paragraph("\n"));

            // Verification information
            document.add(
                    new Paragraph(
                            "Scan the QR Code or use the Credential ID "
                                    + "to verify this document."
                    )
                    .setTextAlignment(TextAlignment.CENTER)
            );

            document.add(
                    new Paragraph(
                            "Credential ID: " +
                            credential.getCredentialId()
                    )
                    .setTextAlignment(TextAlignment.CENTER)
            );

            document.add(
                    new Paragraph(
                            "Verification URL: " +
                            credential.getQrData()
                    )
                    .setTextAlignment(TextAlignment.CENTER)
            );

            document.add(new Paragraph("\n\n"));

            // Footer
            document.add(
                    new Paragraph(
                            "Digitally issued by Zero Trust "
                                    + "Student Document Platform."
                    )
                    .setTextAlignment(TextAlignment.CENTER)
            );

            document.close();

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to generate PDF certificate",
                    e
            );
        }
    }
}