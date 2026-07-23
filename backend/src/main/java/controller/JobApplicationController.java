package com.online_job_portal.online_job_portal.controller;

import com.online_job_portal.online_job_portal.entity.JobApplication;
import com.online_job_portal.online_job_portal.service.JobApplicationService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(
            JobApplicationService service
    ) {
        this.service = service;
    }


    // APPLY FOR JOB
    @PostMapping(
            consumes = "multipart/form-data"
    )
    public ResponseEntity<JobApplication> applyForJob(

            @RequestParam String applicantName,

            @RequestParam String applicantEmail,

            @RequestParam Long jobId,

            @RequestParam String jobTitle,

            @RequestParam MultipartFile resume

    ) throws IOException {

        JobApplication application =
                new JobApplication();

        application.setApplicantName(
                applicantName
        );

        application.setApplicantEmail(
                applicantEmail
        );

        application.setJobId(
                jobId
        );

        application.setJobTitle(
                jobTitle
        );

        application.setResumeName(
                resume.getOriginalFilename()
        );

        JobApplication savedApplication =
                service.saveApplication(
                        application,
                        resume
                );

        return ResponseEntity.ok(
                savedApplication
        );
    }


    // JOB SEEKER - MY APPLICATIONS
    @GetMapping("/{email}")
    public ResponseEntity<List<JobApplication>>
    getMyApplications(
            @PathVariable String email
    ) {

        return ResponseEntity.ok(
                service.getApplicationsByEmail(
                        email
                )
        );
    }


    // EMPLOYER - APPLICATIONS FOR A JOB
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplication>>
    getApplicationsByJobId(
            @PathVariable Long jobId
    ) {

        return ResponseEntity.ok(
                service.getApplicationsByJobId(
                        jobId
                )
        );
    }


    // UPDATE APPLICATION STATUS
    @PutMapping("/{id}/status")
    public ResponseEntity<JobApplication>
    updateStatus(

            @PathVariable Long id,

            @RequestParam String status

    ) {

        JobApplication updatedApplication =
                service.updateStatus(
                        id,
                        status
                );

        return ResponseEntity.ok(
                updatedApplication
        );
    }


    // DOWNLOAD RESUME
    @GetMapping("/resume/{filename:.+}")
    public ResponseEntity<Resource>
    downloadResume(
            @PathVariable String filename
    ) {

        try {

            Path filePath =
                    Paths.get("uploads")
                            .resolve(filename)
                            .normalize();

            Resource resource =
                    new UrlResource(
                            filePath.toUri()
                    );

            if (
                    resource.exists()
                            &&
                            resource.isReadable()
            ) {

                return ResponseEntity.ok()
                        .header(
                                HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" +
                                        resource.getFilename() +
                                        "\""
                        )
                        .body(resource);
            }

            return ResponseEntity
                    .notFound()
                    .build();

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }
}