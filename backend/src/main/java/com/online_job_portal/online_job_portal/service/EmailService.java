
package com.online_job_portal.online_job_portal.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendStatusEmail(
            String to,
            String name,
            String jobTitle,
            String status) {

        try {
            if (to == null || to.isBlank()) {
                throw new IllegalArgumentException(
                        "Applicant email is missing");
            }

            String candidateName =
                    (name == null || name.isBlank())
                            ? "Candidate" : name;

            String title =
                    (jobTitle == null || jobTitle.isBlank())
                            ? "the job you applied for" : jobTitle;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to.trim());

            if ("SHORTLISTED".equalsIgnoreCase(status)) {
                message.setSubject(
                        "Congratulations! You have been shortlisted");

                message.setText(
                        "Hi " + candidateName + ",\n\n"
                                + "Congratulations! You have been shortlisted for "
                                + title + ".\n\n"
                                + "The recruitment team will contact you with the next steps.\n\n"
                                + "Regards,\nRecruitment Team");

            } else if ("REJECTED".equalsIgnoreCase(status)) {
                message.setSubject("Update on your job application");

                message.setText(
                        "Hi " + candidateName + ",\n\n"
                                + "Thank you for applying for " + title + ".\n"
                                + "Unfortunately, we will not be moving forward "
                                + "with your application at this time.\n\n"
                                + "We appreciate your interest.\n\n"
                                + "Regards,\nRecruitment Team");

            } else {
                throw new IllegalArgumentException(
                        "Unsupported status: " + status);
            }

            mailSender.send(message);
            System.out.println(
                    "Status email sent successfully to " + to);

        } catch (Exception e) {
            System.err.println(
                    "Failed to send status email to " + to);
            e.printStackTrace();
        }
    }
}
