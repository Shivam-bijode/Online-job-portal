import { useEffect, useState } from "react";
import "./App.css";
import JobDetails from "./JobDetails";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [showApplications, setShowApplications] = useState(false);
  const [applications, setApplications] = useState([]);

  const [showEmployerDashboard, setShowEmployerDashboard] =
    useState(false);

  const [employerJobs, setEmployerJobs] = useState([]);
  const [showEmployerApplications, setShowEmployerApplications] =
    useState(false);
  const [employerApplications, setEmployerApplications] =
    useState([]);

  // LOGIN
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // REGISTER
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState("");

  // APPLY
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [resume, setResume] = useState(null);

  // POST JOB
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");

  // FORGOT PASSWORD
  const [showForgotPassword, setShowForgotPassword] =
    useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // EDIT JOB
  const [showEditJob, setShowEditJob] = useState(false);
  const [editJob, setEditJob] = useState(null);

  // FILTERS
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  // LOADING AND ERROR
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ADMIN
  const [showAdminDashboard, setShowAdminDashboard] =
    useState(false);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

  // FETCH JOBS
  useEffect(() => {
    fetch("http://localhost:8081/api/jobs")
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setError(
          "Unable to load jobs. Please try again later."
        );
        setLoading(false);
      });
  }, []);

  // REGISTER
  const handleRegister = async () => {
    if (
      registerName === "" ||
      registerEmail === "" ||
      registerPassword === "" ||
      registerRole === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    const userData = {
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      role: registerRole,
    };

    try {
      const response = await fetch(
        "http://localhost:8081/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        alert("Registration successful!");

        setShowRegister(false);
        setShowLogin(true);

        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterRole("");
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
      console.error(error);
      alert("Backend server is not running");
    }
  };

  // LOGIN
  const handleLogin = async () => {
    if (
      loginEmail === "" ||
      loginPassword === ""
    ) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8081/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        }
      );

      if (response.ok) {
        const loggedInUser = await response.json();

        setUser({
          name: loggedInUser.name,
          email: loggedInUser.email,
          role: loggedInUser.role,
        });

        alert("Login successful!");

        setShowLogin(false);
        setLoginEmail("");
        setLoginPassword("");
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
      console.error(error);
      alert("Backend server is not running");
    }
  };

  // VIEW ALL USERS
  const handleViewUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/users"
      );

      if (response.ok) {
        const data = await response.json();

        setUsers(data);
        setShowUsers(true);
      } else {
        alert("Users load nahi ho rahe");
      }
    } catch (error) {
      console.error(error);
      alert("Backend server is not running");
    }
  };
const handleDeleteUser = async (userId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8081/api/users/${userId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      alert("User deleted successfully!");

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== userId
        )
      );
    } else {
      alert("User delete nahi hua");
    }
  } catch (error) {
    console.error(error);
    alert("Backend server is not running");
  }
};

  // FORGOT PASSWORD
  const handleForgotPassword = async () => {
    if (
      forgotEmail === "" ||
      newPassword === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8081/api/users/forgot-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotEmail,
            password: newPassword,
          }),
        }
      );

      if (response.ok) {
        alert("Password updated successfully!");

        setForgotEmail("");
        setNewPassword("");

        setShowForgotPassword(false);
        setShowLogin(true);
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
      console.error(error);
      alert("Backend server is not running");
    }
  };

  // APPLY JOB
  const handleApply = async () => {
    if (!user) {
      alert("Please login first to apply for a job");
      setSelectedJob(null);
      setShowLogin(true);
      return;
    }

    if (
      applicantName === "" ||
      applicantEmail === ""
    ) {
      alert("Please fill your name and email");
      return;
    }

    if (!resume) {
      alert("Please upload your resume");
      return;
    }

    const formData = new FormData();

    formData.append("applicantName", applicantName);
    formData.append("applicantEmail", applicantEmail);
    formData.append("jobId", selectedJob.id);
    formData.append("jobTitle", selectedJob.title);
    formData.append("resume", resume);

    try {
      const response = await fetch(
        "http://localhost:8081/api/applications",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Application submitted successfully!");

        setSelectedJob(null);
        setApplicantName("");
        setApplicantEmail("");
        setResume(null);
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Application Error:", error);
      alert("Application submit nahi ho rahi");
    }
  };

  // MY APPLICATIONS
  const handleMyApplications = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/applications/${user.email}`
      );

      if (response.ok) {
        const data = await response.json();

        setApplications(data);
        setShowApplications(true);
      } else {
        alert("Applications load nahi ho rahi");
      }
    } catch (error) {
      console.error(error);
      alert("Backend server is not running");
    }
  };

  // POST JOB
  const handlePostJob = async () => {
    if (
      jobTitle === "" ||
      jobCompany === "" ||
      jobLocation === "" ||
      jobSalary === "" ||
      jobDescription === "" ||
      jobType === "" ||
      experience === ""
    ) {
      alert("Please fill all job details");
      return;
    }

    const jobData = {
      title: jobTitle,
      company: jobCompany,
      location: jobLocation,
      salary: jobSalary,
      description: jobDescription,
      jobType: jobType,
      experience: experience,
      requirements: jobRequirements,
      employerEmail: user.email,
    };

    try {
      const response = await fetch(
        "http://localhost:8081/api/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobData),
        }
      );

      if (response.ok) {
        const newJob = await response.json();

        alert("Job posted successfully!");

        setJobs((previousJobs) => [
          ...previousJobs,
          newJob,
        ]);

        setEmployerJobs((previousJobs) => [
          ...previousJobs,
          newJob,
        ]);

        setJobTitle("");
        setJobCompany("");
        setJobLocation("");
        setJobSalary("");
        setJobDescription("");
        setJobType("");
        setExperience("");
        setJobRequirements("");
      } else {
        const errorMessage = await response.text();
        alert(errorMessage || "Job post nahi hui");
      }
    } catch (error) {
      console.error("Job Post Error:", error);
      alert("Backend server is not running");
    }
  };

  // GET EMPLOYER JOBS
  const handleEmployerJobs = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/jobs"
      );

      if (response.ok) {
        const allJobs = await response.json();

        const myJobs = allJobs.filter(
          (job) =>
            job.employerEmail === user.email
        );

        setEmployerJobs(myJobs);
      } else {
        alert("Jobs load nahi ho rahi");
      }
    } catch (error) {
      console.error(error);
      alert("Backend server is not running");
    }
  };

  // VIEW APPLICATIONS
  const handleViewApplications = async (jobId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/applications/job/${jobId}`
      );

      if (response.ok) {
        const data = await response.json();

        setEmployerApplications(data);
        setShowEmployerDashboard(false);
        setShowEmployerApplications(true);
      } else {
        alert("Applications load nahi ho rahi");
      }
    } catch (error) {
      console.error(error);
      alert("Backend server is not running");
    }
  };

  // UPDATE STATUS
  const handleUpdateStatus = async (
    applicationId,
    status
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/applications/${applicationId}/status?status=${status}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        const updatedApplication =
          await response.json();

        setEmployerApplications(
          (previousApplications) =>
            previousApplications.map(
              (application) =>
                application.id ===
                updatedApplication.id
                  ? updatedApplication
                  : application
            )
        );

        alert("Application status updated!");
      } else {
        alert("Status update nahi hua");
      }
    } catch (error) {
      console.error(error);
      alert("Backend server is not running");
    }
  };

  // DELETE JOB
  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/jobs/${jobId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Job deleted successfully!");

        setEmployerJobs((previousJobs) =>
          previousJobs.filter(
            (job) => job.id !== jobId
          )
        );

        setJobs((previousJobs) =>
          previousJobs.filter(
            (job) => job.id !== jobId
          )
        );
      } else {
        alert("Job delete nahi hui");
      }
    } catch (error) {
      console.error(error);
      alert("Backend server is not running");
    }
  };

  // EDIT JOB
  const handleEditJob = (job) => {
    setEditJob(job);

    setJobTitle(job.title);
    setJobCompany(job.company);
    setJobLocation(job.location);
    setJobSalary(job.salary);
    setJobDescription(job.description);

    setShowEditJob(true);
  };

  // UPDATE JOB
  const handleUpdateJob = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/jobs/${editJob.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: jobTitle,
            company: jobCompany,
            location: jobLocation,
            salary: jobSalary,
            description: jobDescription,
            employerEmail: editJob.employerEmail,
          }),
        }
      );

      if (response.ok) {
        const updatedJob = await response.json();

        alert("Job updated successfully!");

        setJobs((previousJobs) =>
          previousJobs.map((job) =>
            job.id === updatedJob.id
              ? updatedJob
              : job
          )
        );

        setEmployerJobs((previousJobs) =>
          previousJobs.map((job) =>
            job.id === updatedJob.id
              ? updatedJob
              : job
          )
        );

        setShowEditJob(false);
        setEditJob(null);

        setJobTitle("");
        setJobCompany("");
        setJobLocation("");
        setJobSalary("");
        setJobDescription("");
      } else {
        alert("Job update nahi hui");
      }
    } catch (error) {
      console.error(error);
      alert("Backend server is not running");
    }
  };

  // FILTER JOBS
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      job.company
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      job.location
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesLocation =
      locationFilter === "" ||
      job.location === locationFilter;

    const matchesJobType =
      jobTypeFilter === "" ||
      job.jobType === jobTypeFilter;

    const matchesExperience =
      experienceFilter === "" ||
      job.experience === experienceFilter;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesJobType &&
      matchesExperience
    );
  });

  return (
    <div className="app">

      {/* JOB DETAILS */}
      {showJobDetails && selectedJob ? (
        <JobDetails
          job={selectedJob}
          onBack={() => {
            setShowJobDetails(false);
            setSelectedJob(null);
          }}
          onApply={() => {
            setShowJobDetails(false);
          }}
        />
      ) : (
        <>
          {/* NAVBAR */}
          <nav>
            <h2>JobPortal</h2>

            <div>
              {user ? (
                <>
                  <span>
                    Welcome, {user.name}
                  </span>

                  {user.role === "Job Seeker" && (
                    <button
                      onClick={handleMyApplications}
                    >
                      My Applications
                    </button>
                  )}

                  {user.role === "Employer" && (
                    <button
                      onClick={async () => {
                        await handleEmployerJobs();
                        setShowEmployerDashboard(true);
                      }}
                    >
                      Employer Dashboard
                    </button>
                  )}

                  {user.role === "Admin" && (
                    <button
                      onClick={() =>
                        setShowAdminDashboard(true)
                      }
                    >
                      Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUser(null);
                      setEmployerJobs([]);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() =>
                      setShowLogin(true)
                    }
                  >
                    Login
                  </button>

                  <button
                    onClick={() =>
                      setShowRegister(true)
                    }
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* HERO */}
          <section className="hero">
            <h1>Find Your Dream Job</h1>

            <p>
              Search and apply for your dream job easily.
            </p>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search by job title, company or location"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

              <button>Search</button>
            </div>

            <div className="filters">
              <select
                value={locationFilter}
                onChange={(e) =>
                  setLocationFilter(e.target.value)
                }
              >
                <option value="">
                  All Locations
                </option>
                <option value="Bangalore">
                  Bangalore
                </option>
                <option value="Mumbai">
                  Mumbai
                </option>
                <option value="Delhi">
                  Delhi
                </option>
                <option value="Pune">
                  Pune
                </option>
              </select>

              <select
                value={jobTypeFilter}
                onChange={(e) =>
                  setJobTypeFilter(e.target.value)
                }
              >
                <option value="">
                  All Job Types
                </option>
                <option value="Full Time">
                  Full Time
                </option>
                <option value="Part Time">
                  Part Time
                </option>
                <option value="Internship">
                  Internship
                </option>
                <option value="Remote">
                  Remote
                </option>
              </select>

              <select
                value={experienceFilter}
                onChange={(e) =>
                  setExperienceFilter(e.target.value)
                }
              >
                <option value="">
                  All Experience
                </option>
                <option value="Fresher">
                  Fresher
                </option>
                <option value="1-2 Years">
                  1-2 Years
                </option>
                <option value="3-5 Years">
                  3-5 Years
                </option>
                <option value="5+ Years">
                  5+ Years
                </option>
              </select>
            </div>
          </section>

          {/* JOBS */}
          <div className="jobs-section">
            <h2>Latest Jobs</h2>

            <div className="job-container">
              {loading ? (
                <h3>Loading jobs...</h3>
              ) : error ? (
                <h3 className="error-message">
                  {error}
                </h3>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    className="job-card"
                    key={job.id}
                  >
                    <h3>{job.title}</h3>

                    <p>🏢 {job.company}</p>
                    <p>📍 {job.location}</p>
                    <p>💰 {job.salary}</p>

                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setShowJobDetails(true);
                      }}
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setShowJobDetails(false);
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                ))
              ) : (
                <h3>No jobs found</h3>
              )}
            </div>
          </div>

          {/* LOGIN */}
          {showLogin && (
            <div className="login-overlay">
              <div className="login-box">
                <h2>Login</h2>

                <input
                  type="email"
                  placeholder="Enter Email"
                  value={loginEmail}
                  onChange={(e) =>
                    setLoginEmail(e.target.value)
                  }
                />

                <input
                  type="password"
                  placeholder="Enter Password"
                  value={loginPassword}
                  onChange={(e) =>
                    setLoginPassword(e.target.value)
                  }
                />

                <button onClick={handleLogin}>
                  Login
                </button>

                <button
                  onClick={() => {
                    setShowLogin(false);
                    setShowForgotPassword(true);
                  }}
                >
                  Forgot Password?
                </button>

                <button
                  onClick={() =>
                    setShowLogin(false)
                  }
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* FORGOT PASSWORD */}
          {showForgotPassword && (
            <div className="login-overlay">
              <div className="login-box">
                <h2>Forgot Password</h2>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) =>
                    setForgotEmail(e.target.value)
                  }
                />

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                />

                <button
                  onClick={handleForgotPassword}
                >
                  Reset Password
                </button>

                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setShowLogin(true);
                  }}
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}

          {/* REGISTER */}
          {showRegister && (
            <div className="login-overlay">
              <div className="login-box">
                <h2>Create Account</h2>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={registerName}
                  onChange={(e) =>
                    setRegisterName(e.target.value)
                  }
                />

                <input
                  type="email"
                  placeholder="Enter Email"
                  value={registerEmail}
                  onChange={(e) =>
                    setRegisterEmail(e.target.value)
                  }
                />

                <input
                  type="password"
                  placeholder="Create Password"
                  value={registerPassword}
                  onChange={(e) =>
                    setRegisterPassword(e.target.value)
                  }
                />

                <select
                  value={registerRole}
                  onChange={(e) =>
                    setRegisterRole(e.target.value)
                  }
                >
                  <option value="">
                    Select Role
                  </option>

                  <option value="Job Seeker">
                    Job Seeker
                  </option>

                  <option value="Employer">
                    Employer
                  </option>
                </select>

                <button
                  onClick={handleRegister}
                >
                  Register
                </button>

                <button
                  onClick={() =>
                    setShowRegister(false)
                  }
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* APPLY */}
          {selectedJob && (
            <div className="login-overlay">
              <div className="login-box">
                <h2>Apply for Job</h2>

                <h3>{selectedJob.title}</h3>

                <p>
                  Company: {selectedJob.company}
                </p>

                <p>
                  Location: {selectedJob.location}
                </p>

                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={applicantName}
                  onChange={(e) =>
                    setApplicantName(e.target.value)
                  }
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  value={applicantEmail}
                  onChange={(e) =>
                    setApplicantEmail(e.target.value)
                  }
                />

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setResume(e.target.files[0])
                  }
                />

                <button
                  onClick={handleApply}
                >
                  Submit Application
                </button>

                <button
                  onClick={() =>
                    setSelectedJob(null)
                  }
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* MY APPLICATIONS */}
          {showApplications && (
            <div className="login-overlay">
              <div className="login-box applications-box">
                <h2>My Applications</h2>

                {applications.length > 0 ? (
                  applications.map(
                    (application) => (
                      <div
                        className="application-card"
                        key={application.id}
                      >
                        <h3>
                          {application.jobTitle}
                        </h3>

                        <p>
                          Status:{" "}
                          {application.status ||
                            "Pending"}
                        </p>

                        <p>
                          Applicant:{" "}
                          {application.applicantName}
                        </p>

                        <p>
                          Email:{" "}
                          {application.applicantEmail}
                        </p>

                        <p>
                          Resume:{" "}
                          {application.resumeName}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p>
                    You have not applied for any job yet.
                  </p>
                )}

                <button
                  onClick={() =>
                    setShowApplications(false)
                  }
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* EMPLOYER APPLICATIONS */}
          {showEmployerApplications && (
            <div className="login-overlay">
              <div className="login-box applications-box">
                <h2>Job Applications</h2>

                {employerApplications.length > 0 ? (
                  employerApplications.map(
                    (application) => (
                      <div
                        className="application-card"
                        key={application.id}
                      >
                        <h3>
                          {application.applicantName}
                        </h3>

                        <p>
                          Email:{" "}
                          {application.applicantEmail}
                        </p>

                        <p>
                          Resume:{" "}
                          {application.resumeName}
                        </p>

                        <button
                          onClick={() =>
                            window.open(
                              `http://localhost:8081/api/applications/resume/${encodeURIComponent(
                                application.resumeName
                              )}`,
                              "_blank"
                            )
                          }
                        >
                          Download Resume
                        </button>

                        <p>
                          Current Status:{" "}
                          {application.status ||
                            "Pending"}
                        </p>

                        <select
                          value={
                            application.status ||
                            "Pending"
                          }
                          onChange={(e) =>
                            handleUpdateStatus(
                              application.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Shortlisted">
                            Shortlisted
                          </option>

                          <option value="Rejected">
                            Rejected
                          </option>
                        </select>
                      </div>
                    )
                  )
                ) : (
                  <p>
                    No applications received yet.
                  </p>
                )}

                <button
                  onClick={() =>
                    setShowEmployerApplications(false)
                  }
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* EMPLOYER DASHBOARD */}
          {showEmployerDashboard && (
            <div className="login-overlay">
              <div className="login-box applications-box">
                <h2>Employer Dashboard</h2>

                <h3>Post New Job</h3>

                <input
                  type="text"
                  placeholder="Job Title"
                  value={jobTitle}
                  onChange={(e) =>
                    setJobTitle(e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Company Name"
                  value={jobCompany}
                  onChange={(e) =>
                    setJobCompany(e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={jobLocation}
                  onChange={(e) =>
                    setJobLocation(e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Salary"
                  value={jobSalary}
                  onChange={(e) =>
                    setJobSalary(e.target.value)
                  }
                />

                <select
                  value={jobType}
                  onChange={(e) =>
                    setJobType(e.target.value)
                  }
                >
                  <option value="">
                    Select Job Type
                  </option>

                  <option value="Full Time">
                    Full Time
                  </option>

                  <option value="Part Time">
                    Part Time
                  </option>

                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Remote">
                    Remote
                  </option>
                </select>

                <select
                  value={experience}
                  onChange={(e) =>
                    setExperience(e.target.value)
                  }
                >
                  <option value="">
                    Select Experience
                  </option>

                  <option value="Fresher">
                    Fresher
                  </option>

                  <option value="1-2 Years">
                    1-2 Years
                  </option>

                  <option value="3-5 Years">
                    3-5 Years
                  </option>

                  <option value="5+ Years">
                    5+ Years
                  </option>
                </select>

                <textarea
                  placeholder="Job Description"
                  value={jobDescription}
                  onChange={(e) =>
                    setJobDescription(e.target.value)
                  }
                />

                <textarea
                  placeholder="Job Requirements"
                  value={jobRequirements}
                  onChange={(e) =>
                    setJobRequirements(e.target.value)
                  }
                />

                <button
                  onClick={handlePostJob}
                >
                  Post Job
                </button>

                <hr />

                <h3>My Posted Jobs</h3>

                {employerJobs.length > 0 ? (
                  employerJobs.map((job) => (
                    <div
                      className="application-card"
                      key={job.id}
                    >
                      <h3>{job.title}</h3>

                      <p>
                        Company: {job.company}
                      </p>

                      <p>
                        Location: {job.location}
                      </p>

                      <p>
                        Salary: {job.salary}
                      </p>

                      <button
                        onClick={() =>
                          handleViewApplications(
                            job.id
                          )
                        }
                      >
                        View Applications
                      </button>

                      <button
                        onClick={() =>
                          handleEditJob(job)
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteJob(job.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p>
                    You have not posted any jobs yet.
                  </p>
                )}

                <button
                  onClick={() =>
                    setShowEmployerDashboard(false)
                  }
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* ADMIN DASHBOARD */}
          {showAdminDashboard && (
            <div className="login-overlay">
              <div className="login-box applications-box">
                <h2>Admin Dashboard</h2>

                <button
                  onClick={handleViewUsers}
                >
                  View All Users
                </button>

                {showUsers && (
                  <>
                    <hr />

                    <h3>All Users</h3>

                    {users.length > 0 ? (
                      users.map((user) => (
                        <div
                          className="application-card"
                          key={user.id}
                        >
                          <h3>
                            {user.name}
                          </h3>

                          <p>
                            Email: {user.email}
                          </p>

                          <p>
                            Role: {user.role}
                          </p>
                          <button
                            onClick={() =>
                              handleDeleteUser(user.id)
                            }
                          >
                            Delete User
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No users found</p>
                    )}
                  </>
                )}

                <h3>
                  Welcome Admin 👋
                </h3>

                <p>
                  Admin can manage users, jobs and
                  applications.
                </p>

                <hr />

                <h3>All Jobs</h3>

                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div
                      className="application-card"
                      key={job.id}
                    >
                      <h3>{job.title}</h3>

                      <p>
                        Company: {job.company}
                      </p>

                      <p>
                        Location: {job.location}
                      </p>

                      <p>
                        Employer:{" "}
                        {job.employerEmail}
                      </p>

                      <button
                        onClick={() =>
                          handleDeleteJob(job.id)
                        }
                      >
                        Delete Job
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No jobs available</p>
                )}

                <button
                  onClick={() =>
                    setShowAdminDashboard(false)
                  }
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;