package com.rkchoco.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailService {


    private final JavaMailSender mailSender;


    public EmailService(
            JavaMailSender mailSender
    ) {

        this.mailSender = mailSender;

    }


    // =====================================================
    // ADMIN PASSWORD RESET OTP EMAIL
    // =====================================================

    public void sendAdminOtpEmail(
            String toEmail,
            String otp
    ) {


        SimpleMailMessage message =
                new SimpleMailMessage();


        message.setTo(toEmail);


        message.setSubject(
                "RK Choco Distributors - Admin Password Reset OTP"
        );


        message.setText(

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

                "RK Choco Distributors"

        );


        mailSender.send(message);

    }


    // =====================================================
    // CUSTOMER PASSWORD RESET OTP EMAIL
    // =====================================================

    public void sendCustomerOtpEmail(
            String toEmail,
            String otp
    ) {


        SimpleMailMessage message =
                new SimpleMailMessage();


        message.setTo(toEmail);


        message.setSubject(
                "RK Choco Distributors - Customer Password Reset OTP"
        );


        message.setText(

                "Hello,\n\n" +

                "You requested to reset your RK Choco Distributors account password.\n\n" +

                "Your Password Reset OTP is:\n\n" +

                otp +

                "\n\n" +

                "This OTP is valid for 5 minutes only.\n\n" +

                "If you did not request this password reset, " +

                "please ignore this email.\n\n" +

                "Regards,\n" +

                "RK Choco Distributors"

        );


        mailSender.send(message);

    }

}