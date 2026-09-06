package com.rkchoco.backend.controller;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rkchoco.backend.model.Customer;
import com.rkchoco.backend.model.ResetOtp;
import com.rkchoco.backend.repository.CustomerRepository;
import com.rkchoco.backend.repository.ResetOtpRepository;
import com.rkchoco.backend.service.EmailService;

@RestController
@RequestMapping("/api/customer-password")
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
public class CustomerForgotPasswordController {


    private final CustomerRepository customerRepository;

    private final ResetOtpRepository resetOtpRepository;

    private final EmailService emailService;


    public CustomerForgotPasswordController(
            CustomerRepository customerRepository,
            ResetOtpRepository resetOtpRepository,
            EmailService emailService
    ) {

        this.customerRepository =
                customerRepository;

        this.resetOtpRepository =
                resetOtpRepository;

        this.emailService =
                emailService;
    }


    /*
     * =====================================================
     * SEND RESET OTP
     * EMAIL ONLY
     * =====================================================
     */

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(
            @RequestBody OtpRequest request
    ) {


        if (
                request == null
                        || request.getIdentifier() == null
                        || request.getIdentifier()
                        .trim()
                        .isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Please enter your registered email address."
                    );
        }


        String email =
                request.getIdentifier()
                        .trim()
                        .toLowerCase();


        /*
         * =================================================
         * CHECK EMAIL FORMAT
         * =================================================
         */

        if (
                !email.contains("@")
                        || !email.contains(".")
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Please enter a valid email address."
                    );
        }


        /*
         * =================================================
         * FIND CUSTOMER BY EMAIL
         * =================================================
         */

        Customer customer =
                customerRepository
                        .findByEmail(email)
                        .orElse(null);


        /*
         * =================================================
         * CUSTOMER NOT FOUND
         * =================================================
         */

        if (customer == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            "No registered account found with this email address."
                    );
        }


        /*
         * =================================================
         * ACCOUNT STATUS
         * =================================================
         */

        if (
                customer.getStatus() != null
                        && customer.getStatus()
                        .equalsIgnoreCase("inactive")
        ) {

            return ResponseEntity
                    .status(403)
                    .body(
                            "Your account is inactive. Please contact us."
                    );
        }


        /*
         * =================================================
         * GENERATE 6 DIGIT OTP
         * =================================================
         */

        String otp =
                String.format(
                        "%06d",
                        new Random().nextInt(1000000)
                );


        /*
         * =================================================
         * OTP EXPIRES AFTER 5 MINUTES
         * =================================================
         */

        LocalDateTime expiresAt =
                LocalDateTime
                        .now()
                        .plusMinutes(5);


        /*
         * =================================================
         * SAVE OTP
         * =================================================
         */

        ResetOtp resetOtp =
                new ResetOtp();

        resetOtp.setIdentifier(email);

        resetOtp.setOtp(otp);

        resetOtp.setExpiresAt(expiresAt);


        resetOtpRepository.save(resetOtp);


        /*
         * =================================================
         * SEND OTP TO CUSTOMER EMAIL
         * =================================================
         */

        try {

            emailService.sendCustomerOtpEmail(
                    customer.getEmail(),
                    otp
            );


            return ResponseEntity.ok(
                    new OtpResponse(
                            "Reset OTP sent to your email.",
                            null
                    )
            );


        } catch (Exception e) {

            e.printStackTrace();


            /*
             * Remove OTP if email failed
             */

            resetOtpRepository.delete(resetOtp);


            return ResponseEntity
                    .status(500)
                    .body(
                            "OTP could not be sent. Please check Gmail configuration."
                    );
        }
    }


    /*
     * =====================================================
     * VERIFY OTP
     * =====================================================
     */

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody VerifyOtpRequest request
    ) {


        if (
                request == null
                        || request.getIdentifier() == null
                        || request.getIdentifier()
                        .trim()
                        .isEmpty()
                        || request.getOtp() == null
                        || request.getOtp()
                        .trim()
                        .isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Please enter your email address and OTP."
                    );
        }


        String email =
                request.getIdentifier()
                        .trim()
                        .toLowerCase();


        String otp =
                request.getOtp()
                        .trim();


        /*
         * =================================================
         * FIND LATEST OTP
         * =================================================
         */

        Optional<ResetOtp> otpOptional =
                resetOtpRepository
                        .findTopByIdentifierOrderByIdDesc(
                                email
                        );


        if (otpOptional.isEmpty()) {

            return ResponseEntity
                    .status(400)
                    .body(
                            "Invalid OTP. Please request a new OTP."
                    );
        }


        ResetOtp resetOtp =
                otpOptional.get();


        /*
         * =================================================
         * CHECK EXPIRY
         * =================================================
         */

        if (
                LocalDateTime.now()
                        .isAfter(
                                resetOtp.getExpiresAt()
                        )
        ) {

            return ResponseEntity
                    .status(400)
                    .body(
                            "OTP has expired. Please request a new OTP."
                    );
        }


        /*
         * =================================================
         * CHECK OTP
         * =================================================
         */

        if (
                !resetOtp.getOtp()
                        .equals(otp)
        ) {

            return ResponseEntity
                    .status(400)
                    .body(
                            "Incorrect OTP. Please try again."
                    );
        }


        /*
         * =================================================
         * OTP VERIFIED
         * =================================================
         */

        return ResponseEntity.ok(
                "OTP verified successfully."
        );
    }


    /*
     * =====================================================
     * RESET PASSWORD
     * =====================================================
     */

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {


        if (
                request == null
                        || request.getIdentifier() == null
                        || request.getIdentifier()
                        .trim()
                        .isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Please enter your email address."
                    );
        }


        if (
                request.getOtp() == null
                        || request.getOtp()
                        .trim()
                        .isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Please enter the OTP."
                    );
        }


        if (
                request.getNewPassword() == null
                        || request.getNewPassword()
                        .trim()
                        .isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Please enter your new password."
                    );
        }


        if (
                request.getConfirmPassword() == null
                        || request.getConfirmPassword()
                        .trim()
                        .isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Please confirm your new password."
                    );
        }


        /*
         * =================================================
         * PASSWORD MATCH
         * =================================================
         */

        if (
                !request.getNewPassword()
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
                request.getIdentifier()
                        .trim()
                        .toLowerCase();


        String otp =
                request.getOtp()
                        .trim();


        /*
         * =================================================
         * FIND LATEST OTP
         * =================================================
         */

        Optional<ResetOtp> otpOptional =
                resetOtpRepository
                        .findTopByIdentifierOrderByIdDesc(
                                email
                        );


        if (otpOptional.isEmpty()) {

            return ResponseEntity
                    .status(400)
                    .body(
                            "OTP not found. Please request a new OTP."
                    );
        }


        ResetOtp resetOtp =
                otpOptional.get();


        /*
         * =================================================
         * CHECK OTP EXPIRY
         * =================================================
         */

        if (
                LocalDateTime.now()
                        .isAfter(
                                resetOtp.getExpiresAt()
                        )
        ) {

            return ResponseEntity
                    .status(400)
                    .body(
                            "OTP has expired. Please request a new OTP."
                    );
        }


        /*
         * =================================================
         * CHECK OTP
         * =================================================
         */

        if (
                !resetOtp.getOtp()
                        .equals(otp)
        ) {

            return ResponseEntity
                    .status(400)
                    .body(
                            "Incorrect OTP."
                    );
        }


        /*
         * =================================================
         * FIND CUSTOMER
         * =================================================
         */

        Customer customer =
                customerRepository
                        .findByEmail(email)
                        .orElse(null);


        if (customer == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            "Customer account not found."
                    );
        }


        /*
         * =================================================
         * UPDATE PASSWORD
         * =================================================
         */

        customer.setPassword(
                request.getNewPassword()
        );


        customerRepository.save(customer);


        /*
         * =================================================
         * DELETE USED OTP
         * =================================================
         */

        resetOtpRepository
                .findTopByIdentifierOrderByIdDesc(
                        email
                )
                .ifPresent(
                        resetOtpRepository::delete
                );


        /*
         * =================================================
         * SUCCESS
         * =================================================
         */

        return ResponseEntity.ok(
                "Password reset successfully."
        );
    }


    /*
     * =====================================================
     * OTP REQUEST
     * =====================================================
     */

    public static class OtpRequest {

        private String identifier;


        public OtpRequest() {
        }


        public String getIdentifier() {

            return identifier;
        }


        public void setIdentifier(
                String identifier
        ) {

            this.identifier = identifier;
        }
    }


    /*
     * =====================================================
     * VERIFY OTP REQUEST
     * =====================================================
     */

    public static class VerifyOtpRequest {

        private String identifier;

        private String otp;


        public VerifyOtpRequest() {
        }


        public String getIdentifier() {

            return identifier;
        }


        public void setIdentifier(
                String identifier
        ) {

            this.identifier = identifier;
        }


        public String getOtp() {

            return otp;
        }


        public void setOtp(
                String otp
        ) {

            this.otp = otp;
        }
    }


    /*
     * =====================================================
     * RESET PASSWORD REQUEST
     * =====================================================
     */

    public static class ResetPasswordRequest {

        private String identifier;

        private String otp;

        private String newPassword;

        private String confirmPassword;


        public ResetPasswordRequest() {
        }


        public String getIdentifier() {

            return identifier;
        }


        public void setIdentifier(
                String identifier
        ) {

            this.identifier = identifier;
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

            this.newPassword = newPassword;
        }


        public String getConfirmPassword() {

            return confirmPassword;
        }


        public void setConfirmPassword(
                String confirmPassword
        ) {

            this.confirmPassword = confirmPassword;
        }
    }


    /*
     * =====================================================
     * OTP RESPONSE
     * =====================================================
     */

    public static class OtpResponse {

        private String message;

        private String otp;


        public OtpResponse(
                String message,
                String otp
        ) {

            this.message = message;

            this.otp = otp;
        }


        public String getMessage() {

            return message;
        }


        public String getOtp() {

            return otp;
        }
    }
}