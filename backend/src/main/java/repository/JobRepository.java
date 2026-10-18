
package com.online_job_portal.online_job_portal.repository;

import com.online_job_portal.online_job_portal.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    @Query(value = "SELECT * FROM jobs", nativeQuery = true)
    List<Job> findAllJobsDirectly();

    List<Job> findByEmployerEmail(String employerEmail);
}
