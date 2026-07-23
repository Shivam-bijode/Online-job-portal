package com.online_job_portal.online_job_portal.repository;

import com.online_job_portal.online_job_portal.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByApplicantEmail(String applicantEmail);
    List<JobApplication> findByJobId(Long jobId);
}