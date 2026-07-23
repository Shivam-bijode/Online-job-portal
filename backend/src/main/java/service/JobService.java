package com.online_job_portal.online_job_portal.service;

import com.online_job_portal.online_job_portal.entity.Job;
import com.online_job_portal.online_job_portal.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    // Get all jobs
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // Create new job
    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    // Get jobs posted by employer
    public List<Job> getJobsByEmployer(
            String employerEmail
    ) {
        return jobRepository.findByEmployerEmail(
                employerEmail
        );
    }

    // Delete job
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    // Update job
    public Job updateJob(
            Long id,
            Job updatedJob
    ) {
        Job existingJob =
                jobRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Job not found"
                                )
                        );

        existingJob.setTitle(
                updatedJob.getTitle()
        );

        existingJob.setCompany(
                updatedJob.getCompany()
        );

        existingJob.setLocation(
                updatedJob.getLocation()
        );

        existingJob.setSalary(
                updatedJob.getSalary()
        );

        existingJob.setDescription(
                updatedJob.getDescription()
        );

        return jobRepository.save(existingJob);
    }
}