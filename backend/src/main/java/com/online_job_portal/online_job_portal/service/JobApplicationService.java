
package com.online_job_portal.online_job_portal.service;

import com.online_job_portal.online_job_portal.entity.JobApplication;
import com.online_job_portal.online_job_portal.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;
    private final EmailService emailService;

    private final String uploadDir = "uploads/";

    public JobApplicationService(
            JobApplicationRepository repository,
            EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    // Save application and resume
    public JobApplication saveApplication(
            JobApplication application,
            MultipartFile resume) throws IOException {

        if (resume != null && !resume.isEmpty()) {
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            String originalFilename = resume.getOriginalFilename();

            if (originalFilename != null && !originalFilename.isBlank()) {
                String filename = Paths.get(originalFilename)
                        .getFileName().toString();

                Path filePath = uploadPath.resolve(filename);
                Files.write(filePath, resume.getBytes());

                application.setResumeName(filename);
            }
        }

        return repository.save(application);
    }

    // Get applications by job ID
    public List<JobApplication> getApplicationsByJobId(Long jobId) {
        return repository.findByJobId(jobId);
    }

    // Get applications by applicant email
    public List<JobApplication> getApplicationsByEmail(String applicantEmail) {
        return repository.findByApplicantEmail(applicantEmail);
    }

    // Update status and send email
    public JobApplication updateStatus(Long id, String status) {

        JobApplication application = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found: " + id));

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException(
                    "Status cannot be empty");
        }

        String normalizedStatus = status.trim().toUpperCase();

        if (!normalizedStatus.equals("SHORTLISTED")
                && !normalizedStatus.equals("REJECTED")) {
            throw new IllegalArgumentException(
                    "Status must be SHORTLISTED or REJECTED");
        }

        application.setStatus(normalizedStatus);

        // Save status in database first
        JobApplication saved = repository.save(application);

        // Send email notification
        try {
            emailService.sendStatusEmail(
                    saved.getApplicantEmail(),
                    saved.getApplicantName(),
                    saved.getJobTitle(),
                    normalizedStatus
            );

            System.out.println(
                    "Status email processed for application ID: "
                            + saved.getId());

        } catch (Exception e) {
            System.err.println(
                    "Status saved, but email sending failed.");
            e.printStackTrace();
        }

        return saved;
    }
}
