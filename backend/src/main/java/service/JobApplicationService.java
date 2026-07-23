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

    // Resume upload folder
    private final String uploadDir = "uploads/";

    public JobApplicationService(
            JobApplicationRepository repository
    ) {
        this.repository = repository;
    }


    // SAVE APPLICATION
    public JobApplication saveApplication(
            JobApplication application,
            MultipartFile resume
    ) throws IOException {

        if (resume != null && !resume.isEmpty()) {

            // uploads folder create
            Path uploadPath =
                    Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Resume file save
            Path filePath =
                    uploadPath.resolve(
                            resume.getOriginalFilename()
                    );

            Files.write(
                    filePath,
                    resume.getBytes()
            );

            // Filename database में save
            application.setResumeName(
                    resume.getOriginalFilename()
            );
        }

        return repository.save(application);
    }


    // GET APPLICATIONS BY JOB ID
    public List<JobApplication> getApplicationsByJobId(
            Long jobId
    ) {
        return repository.findByJobId(jobId);
    }


    // GET APPLICATIONS BY EMAIL
    public List<JobApplication> getApplicationsByEmail(
            String applicantEmail
    ) {
        return repository.findByApplicantEmail(
                applicantEmail
        );
    }


    // UPDATE APPLICATION STATUS
    public JobApplication updateStatus(
            Long id,
            String status
    ) {

        JobApplication application =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        application.setStatus(status);

        return repository.save(application);
    }
}