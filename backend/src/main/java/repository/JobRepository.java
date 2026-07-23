package com.online_job_portal.online_job_portal.repository;

import com.online_job_portal.online_job_portal.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByEmployerEmail(String employerEmail);
}