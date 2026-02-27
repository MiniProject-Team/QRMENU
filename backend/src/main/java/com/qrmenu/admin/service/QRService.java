package com.qrmenu.admin.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class QRService {

    private static final int QR_SIZE = 300;

    /**
     * Generate QR code as base64 encoded string
     * @param content The URL or content to encode in the QR code
     * @return Base64 encoded PNG image string
     */
    public String generateQRCodeBase64(String content) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 1);

            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, QR_SIZE, QR_SIZE, hints);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            byte[] bytes = outputStream.toByteArray();
            return "data:image/png;base64," + java.util.Base64.getEncoder().encodeToString(bytes);

        } catch (WriterException | IOException e) {
            throw new RuntimeException("Error generating QR code: " + e.getMessage(), e);
        }
    }

    /**
     * Generate QR code URL for a table
     * @param baseUrl The base application URL
     * @param tableId The table ID
     * @return The full QR code content URL
     */
    public String generateTableQRUrl(String baseUrl, Long tableId) {
        return baseUrl + "/menu/" + tableId;
    }
}
