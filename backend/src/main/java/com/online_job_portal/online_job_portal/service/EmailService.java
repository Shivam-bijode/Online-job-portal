
package com.online_job_portal.online_job_portal.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

@Service
public class EmailService {

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from:onboarding@resend.dev}")
    private String fromEmail;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HttpClient httpClient =
            HttpClient.newHttpClient();

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

            String subject;
            String body;

            if ("SHORTLISTED".equalsIgnoreCase(status)) {
                subject =
                        "Congratulations! You have been shortlisted";

                body = "Hi " + candidateName + ",\n\n"
                        + "Congratulations! You have been shortlisted for "
                        + title + ".\n\n"
                        + "The recruitment team will contact you "
                        + "with the next steps.\n\n"
                        + "Regards,\nRecruitment Team";

            } else if ("REJECTED".equalsIgnoreCase(status)) {
                subject = "Update on your job application";

                body = "Hi " + candidateName + ",\n\n"
                        + "Thank you for applying for " + title + ".\n"
                        + "Unfortunately, we will not be moving forward "
                        + "with your application at this time.\n\n"
                        + "We appreciate your interest.\n\n"
                        + "Regards,\nRecruitment Team";

            } else {
                throw new IllegalArgumentException(
                        "Unsupported status: " + status);
            }

            Map<String, Object> payload = Map.of(
                    "from", fromEmail,
                    "to", new String[]{to.trim()},
                    "subject", subject,
                    "text", body
            );

            String json = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(
                            "https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200
                    && response.statusCode() < 300) {
                System.out.println(
                        "Status email accepted by Resend for " + to
                                + ". Response: " + response.body());
            } else {
                System.err.println(
                        "Resend email API failed. HTTP "
                                + response.statusCode()
                                + ": " + response.body());
            }

        } catch (Exception e) {
            System.err.println(
                    "Failed to send status email to " + to);
            e.printStackTrace();
        }
    }
}
