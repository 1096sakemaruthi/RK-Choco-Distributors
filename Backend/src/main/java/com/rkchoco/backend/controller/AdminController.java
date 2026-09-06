package com.rkchoco.backend.controller;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rkchoco.backend.model.Admin;
import com.rkchoco.backend.model.ResetOtp;
import com.rkchoco.backend.repository.AdminRepository;
import com.rkchoco.backend.repository.ResetOtpRepository;
import com.rkchoco.backend.service.EmailService;

@RestController
@RequestMapping("/api/admin")

@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",

        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:5176",
        "http://127.0.0.1:5177",
        "http://127.0.0.1:5178"
    }
)

public class AdminController {

    private final AdminRepository adminRepository;

    private final EmailService emailService;

    private final ResetOtpRepository resetOtpRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public AdminController(
        AdminRepository adminRepository,
        EmailService emailService,
        ResetOtpRepository resetOtpRepository
    ) {

        this.adminRepository = adminRepository;

        this.emailService = emailService;

        this.resetOtpRepository = resetOtpRepository;

    }


    // =====================================================
    // ADMIN LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(
        @RequestBody Admin loginData
    ) {

        if (
            loginData.getUsername() == null ||
            loginData.getUsername().trim().isEmpty() ||

            loginData.getPassword() == null ||
            loginData.getPassword().isEmpty()
        ) {

            return ResponseEntity
                .badRequest()
                .body(
                    "Please enter Admin Username/Email and Password."
                );

        }


        String loginValue =
            loginData
                .getUsername()
                .trim();


        Optional<Admin> adminOptional;


        if (loginValue.contains("@")) {

            adminOptional =
                adminRepository
                    .findByEmail(loginValue);

        } else {

            adminOptional =
                adminRepository
                    .findByUsername(loginValue);

        }


        if (adminOptional.isEmpty()) {

            return ResponseEntity
                .status(401)
                .body(
                    "Invalid Admin Username/Email or Password."
                );

        }


        Admin admin =
            adminOptional.get();


        if (
            admin.getPassword() == null ||

            !admin
                .getPassword()
                .equals(
                    loginData.getPassword()
                )
        ) {

            return ResponseEntity
                .status(401)
                .body(
                    "Invalid Admin Username/Email or Password."
                );

        }


        if (
            admin.getStatus() != null &&

            !admin
                .getStatus()
                .equalsIgnoreCase("active")
        ) {

            return ResponseEntity
                .status(403)
                .body(
                    "Admin account is inactive."
                );

        }


        return ResponseEntity.ok(admin);

    }


    // =====================================================
    // ADMIN FORGOT PASSWORD
    // SEND OTP TO ADMIN GMAIL
    // =====================================================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
        @RequestBody ForgotPasswordRequest request
    ) {

        if (
            request == null ||

            request.getEmail() == null ||

            request
                .getEmail()
                .trim()
                .isEmpty()
        ) {

            return ResponseEntity
                .badRequest()
                .body(
                    "Please enter Admin email."
                );

        }


        String email =
            request
                .getEmail()
                .trim();


        // =================================================
        // FIND ADMIN
        // =================================================

        Optional<Admin> adminOptional =
            adminRepository
                .findByEmail(email);


        if (adminOptional.isEmpty()) {

            return ResponseEntity
                .status(404)
                .body(
                    "Admin email not found."
                );

        }


        Admin admin =
            adminOptional.get();


        // =================================================
        // STATUS CHECK
        // =================================================

        if (
            admin.getStatus() != null &&

            !admin
                .getStatus()
                .equalsIgnoreCase("active")
        ) {

            return ResponseEntity
                .status(403)
                .body(
                    "Admin account is inactive."
                );

        }


        // =================================================
        // GENERATE 6 DIGIT OTP
        // =================================================

        String otp =
            String.format(
                "%06d",
                ThreadLocalRandom
                    .current()
                    .nextInt(100000, 1000000)
            );


        // =================================================
        // EXPIRY = 5 MINUTES
        // =================================================

        LocalDateTime expiresAt =
            LocalDateTime.now()
                .plusMinutes(5);


        // =================================================
        // DELETE OLD OTP
        // =================================================

        resetOtpRepository
            .findTopByIdentifierOrderByIdDesc(email)
            .ifPresent(
                resetOtpRepository::delete
            );


        // =================================================
        // SAVE NEW OTP
        // =================================================

        ResetOtp resetOtp =
            new ResetOtp();

        resetOtp.setIdentifier(email);

        resetOtp.setOtp(otp);

        resetOtp.setExpiresAt(expiresAt);


        resetOtpRepository.save(resetOtp);


        // =================================================
        // SEND OTP TO GMAIL
        // =================================================

        try {

            emailService.sendAdminOtpEmail(
                email,
                otp
            );

        } catch (Exception e) {

            e.printStackTrace();

            // If email fails, remove saved OTP
            resetOtpRepository.delete(resetOtp);

            return ResponseEntity
                .status(500)
                .body(
                    "Unable to send OTP to your email. Please try again."
                );

        }


        // =================================================
        // SUCCESS
        // =================================================

        return ResponseEntity.ok(
            "OTP has been sent to your registered Admin email. OTP is valid for 5 minutes."
        );

    }


    // =====================================================
    // ADMIN RESET PASSWORD
    // VERIFY OTP + CHANGE PASSWORD
    // =====================================================

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
        @RequestBody ResetPasswordRequest request
    ) {

        // =================================================
        // REQUEST VALIDATION
        // =================================================

        if (request == null) {

            return ResponseEntity
                .badRequest()
                .body(
                    "Invalid reset password request."
                );

        }


        // =================================================
        // EMAIL
        // =================================================

        if (
            request.getEmail() == null ||

            request
                .getEmail()
                .trim()
                .isEmpty()
        ) {

            return ResponseEntity
                .badRequest()
                .body(
                    "Please enter Admin email."
                );

        }


        // =================================================
        // OTP
        // =================================================

        if (
            request.getOtp() == null ||

            request
                .getOtp()
                .trim()
                .isEmpty()
        ) {

            return ResponseEntity
                .badRequest()
                .body(
                    "Please enter OTP."
                );

        }


        if (
            !request
                .getOtp()
                .trim()
                .matches("\\d{6}")
        ) {

            return ResponseEntity
                .badRequest()
                .body(
                    "Please enter a valid 6-digit OTP."
                );

        }


        // =================================================
        // NEW PASSWORD
        // =================================================

        if (
            request.getNewPassword() == null ||

            request
                .getNewPassword()
                .trim()
                .isEmpty()
        ) {

            return ResponseEntity
                .badRequest()
                .body(
                    "Please enter new password."
                );

        }


        // =================================================
        // CONFIRM PASSWORD
        // =================================================

        if (
            request.getConfirmPassword() == null ||

            request
                .getConfirmPassword()
                .trim()
                .isEmpty()
        ) {

            return ResponseEntity
                .badRequest()
                .body(
                    "Please confirm your password."
                );

        }


        // =================================================
        // PASSWORD MATCH
        // =================================================

        if (
            !request
                .getNewPassword()
                .equals(
                    request.getConfirmPassword()
                )
        ) {

            return ResponseEntity
                .badRequest()
                .body(
                    "New password and confirm password do not match."
                );

        }


        String email =
            request
                .getEmail()
                .trim();


        // =================================================
        // FIND ADMIN
        // =================================================

        Optional<Admin> adminOptional =
            adminRepository
                .findByEmail(email);


        if (adminOptional.isEmpty()) {

            return ResponseEntity
                .status(404)
                .body(
                    "Admin email not found."
                );

        }


        Admin admin =
            adminOptional.get();


        // =================================================
        // STATUS
        // =================================================

        if (
            admin.getStatus() != null &&

            !admin
                .getStatus()
                .equalsIgnoreCase("active")
        ) {

            return ResponseEntity
                .status(403)
                .body(
                    "Admin account is inactive."
                );

        }


        // =================================================
        // FIND LATEST OTP
        // =================================================

        Optional<ResetOtp> otpOptional =
            resetOtpRepository
                .findTopByIdentifierOrderByIdDesc(email);


        if (otpOptional.isEmpty()) {

            return ResponseEntity
                .status(400)
                .body(
                    "OTP not found. Please request a new OTP."
                );

        }


        ResetOtp resetOtp =
            otpOptional.get();


        // =================================================
        // CHECK OTP
        // =================================================

        if (
            !resetOtp
                .getOtp()
                .equals(
                    request
                        .getOtp()
                        .trim()
                )
        ) {

            return ResponseEntity
                .status(400)
                .body(
                    "Invalid OTP. Please enter the correct OTP."
                );

        }


        // =================================================
        // CHECK EXPIRY
        // =================================================

        if (
            resetOtp
                .getExpiresAt()
                .isBefore(
                    LocalDateTime.now()
                )
        ) {

            resetOtpRepository.delete(resetOtp);

            return ResponseEntity
                .status(400)
                .body(
                    "OTP has expired. Please request a new OTP."
                );

        }


        // =================================================
        // CHANGE PASSWORD
        // =================================================

        admin.setPassword(
            request.getNewPassword()
        );


        adminRepository.save(admin);


        // =================================================
        // DELETE USED OTP
        // =================================================

        resetOtpRepository.delete(resetOtp);


        // =================================================
        // SUCCESS
        // =================================================

        return ResponseEntity.ok(
            "Admin password reset successfully."
        );

    }


    // =====================================================
    // FORGOT PASSWORD REQUEST
    // =====================================================

    public static class ForgotPasswordRequest {

        private String email;


        public ForgotPasswordRequest() {
        }


        public String getEmail() {

            return email;

        }


        public void setEmail(
            String email
        ) {

            this.email = email;

        }

    }


    // =====================================================
    // RESET PASSWORD REQUEST
    // =====================================================

    public static class ResetPasswordRequest {

        private String email;

        private String otp;

        private String newPassword;

        private String confirmPassword;


        public ResetPasswordRequest() {
        }


        public String getEmail() {

            return email;

        }


        public void setEmail(
            String email
        ) {

            this.email = email;

        }


        public String getOtp() {

            return otp;

        }


        public void setOtp(
            String otp
        ) {

            this.otp = otp;

        }


        public String getNewPassword() {

            return newPassword;

        }


        public void setNewPassword(
            String newPassword
        ) {

            this.newPassword =
                newPassword;

        }


        public String getConfirmPassword() {

            return confirmPassword;

        }


        public void setConfirmPassword(
            String confirmPassword
        ) {

            this.confirmPassword =
                confirmPassword;

        }

    }

}