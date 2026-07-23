package com.online_job_portal.online_job_portal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String applicantName;

    private String applicantEmail;

    private String resumeName;

    private Long jobId;

    private String jobTitle;

    private String status = "Pending";


    // Default Constructor
    public JobApplication() {
    }


    // Parameterized Constructor
    public JobApplication(
            String applicantName,
            String applicantEmail,
            String resumeName,
            Long jobId,
            String jobTitle
    ) {
        this.applicantName = applicantName;
        this.applicantEmail = applicantEmail;
        this.resumeName = resumeName;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.status = "Pending";
    }


    // Getters and Setters

    public Long getId() {
        return id;
    }


    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }


    public String getApplicantEmail() {
        return applicantEmail;
    }

    public void setApplicantEmail(String applicantEmail) {
        this.applicantEmail = applicantEmail;
    }


    public String getResumeName() {
        return resumeName;
    }

    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }


    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }


    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}