package com.online_job_portal.online_job_portal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String company;

    private String location;

    private String salary;

    private String jobType;

    private String experience;

    private String employerEmail;

    @Column(length = 2000)
    private String description;

    @Column(length = 2000)
    private String requirements;


    // Default Constructor
    public Job() {
    }


    // Constructor
    public Job(
            String title,
            String company,
            String location,
            String salary,
            String jobType,
            String experience,
            String description
    ) {
        this.title = title;
        this.company = company;
        this.location = location;
        this.salary = salary;
        this.jobType = jobType;
        this.experience = experience;
        this.description = description;
    }


    // GET ID
    public Long getId() {
        return id;
    }


    // TITLE
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    // COMPANY
    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }


    // LOCATION
    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }


    // SALARY
    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }


    // JOB TYPE
    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }


    // EXPERIENCE
    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }


    // DESCRIPTION
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }


    // EMPLOYER EMAIL
    public String getEmployerEmail() {
        return employerEmail;
    }

    public void setEmployerEmail(String employerEmail) {
        this.employerEmail = employerEmail;
    }
}