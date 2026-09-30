package com.rkchoco.backend.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final HttpClient httpClient;

    public EmailService() {
        this.httpClient = HttpClient.newHttpClient();
    }

    // =====================================================
    // RESEND EMAIL API
    // =====================================================

    private void sendEmail(
            String toEmail,
            String subject,
            String text
    ) {

        String apiKey = System.getenv("RESEND_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("RESEND_API_KEY is not configured.");
        }

        String jsonBody =
                "{"
                        + "\"from\":\"RK Choco Distributors <onboarding@resend.dev>\","
                        + "\"to\":[\"" + toEmail + "\"],"
                        + "\"subject\":\"" + subject + "\","
                        + "\"text\":\"" + text.replace("\n", "\\n").replace("\"", "\\\"") + "\""
                        + "}";

        try {

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if (response.statusCode() < 200 ||
                    response.statusCode() >= 300) {

                throw new RuntimeException(
                        "Resend email failed: " + response.body()
                );
            }

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to send email using Resend API.",
                    e
            );
        }
    }

    // =====================================================
    // ADMIN PASSWORD RESET OTP EMAIL
    // =====================================================

    public void sendAdminOtpEmail(
            String toEmail,
            String otp
    ) {

        String subject =
                "RK Choco Distributors - Admin Password Reset OTP";

        String text =
                "Hello Admin,\n\n" +

                "You requested to reset your RK Choco Distributors Admin password.\n\n" +

                "Your Password Reset OTP is:\n\n" +

                otp +

                "\n\n" +

                "This OTP is valid for 5 minutes only.\n\n" +

                "Please do not share this OTP with anyone.\n\n" +

                "If you did not request this password reset, " +
                "please ignore this email.\n\n" +

                "Regards,\n" +
                "RK Choco Distributors";

        sendEmail(toEmail, subject, text);
    }

    // =====================================================
    // CUSTOMER PASSWORD RESET OTP EMAIL
    // =====================================================

    public void sendCustomerOtpEmail(
            String toEmail,
            String otp
    ) {

        String subject =
                "RK Choco Distributors - Customer Password Reset OTP";

        String text =
                "Hello,\n\n" +

                "You requested to reset your RK Choco Distributors account password.\n\n" +

                "Your Password Reset OTP is:\n\n" +

                otp +

                "\n\n" +

                "This OTP is valid for 5 minutes only.\n\n" +

                "If you did not request this password reset, " +
                "please ignore this email.\n\n" +

                "Regards,\n" +
                "RK Choco Distributors";

        sendEmail(toEmail, subject, text);
    }
}