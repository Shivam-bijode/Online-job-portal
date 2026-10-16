
import { useEffect, useState } from "react";
import "./App.css";
import JobDetails from "./JobDetails";

const API_URL =
  "https://online-job-portal-backend-u9bx.onrender.com";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  return response;
}

function App() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [showEmployerDashboard, setShowEmployerDashboard] = useState(false);
  const [showEmployerApplications, setShowEmployerApplications] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showEditJob, setShowEditJob] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);
  const [editJob, setEditJob] = useState(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [resume, setResume] = useState(null);

  const [applications, setApplications] = useState([]);
  const [employerApplications, setEmployerApplications] = useState([]);
  const [employerJobs, setEmployerJobs] = useState([]);
  const [users, setUsers] = useState([]);

  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");

  // Load all jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/api/jobs");
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid jobs response");
      }

      setJobs(data);
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setError("Unable to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Register
  const handleRegister = async () => {
    if (!registerName.trim() || !registerEmail.trim() ||
        !registerPassword || !registerRole) {
      alert("Please fill all fields");
      return;
    }

    try {
      await apiRequest("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName.trim(),
          email: registerEmail.trim(),
          password: registerPassword,
          role: registerRole,
        }),
      });

      alert("Registration successful!");
      setShowRegister(false);
      setShowLogin(true);
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterRole("");
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  // Login
  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPassword) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await apiRequest("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const loggedInUser = await response.json();

      setUser({
        id: loggedInUser.id,
        name: loggedInUser.name,
        email: loggedInUser.email,
        role: loggedInUser.role,
      });

      setShowLogin(false);
      setLoginEmail("");
      setLoginPassword("");
      alert("Login successful!");
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  // Forgot password
  const handleForgotPassword = async () => {
    if (!forgotEmail.trim() || !newPassword) {
      alert("Please fill all fields");
      return;
    }

    try {
      await apiRequest("/api/users/forgot-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          password: newPassword,
        }),
      });

      alert("Password updated successfully!");
      setForgotEmail("");
      setNewPassword("");
      setShowForgotPassword(false);
      setShowLogin(true);
    } catch (err) {
      alert(err.message || "Password update failed");
    }
  };

  // Apply for a job
  const handleApply = async () => {
    if (!user) {
      alert("Please login first to apply for a job");
      setShowLogin(true);
      return;
    }

    if (!applicantName.trim() || !applicantEmail.trim() || !resume) {
      alert("Please enter your name, email and upload your resume");
      return;
    }

    const formData = new FormData();
    formData.append("applicantName", applicantName.trim());
    formData.append("applicantEmail", applicantEmail.trim());
    formData.append("jobId", String(selectedJob.id));
    formData.append("jobTitle", selectedJob.title);
    formData.append("resume", resume);

    try {
      await apiRequest("/api/applications", {
        method: "POST",
        body: formData,
      });

      alert("Application submitted successfully!");
      setSelectedJob(null);
      setApplicantName("");
      setApplicantEmail("");
      setResume(null);
    } catch (err) {
      alert(err.message || "Application submission failed");
    }
  };

  // My applications
  const handleMyApplications = async () => {
    if (!user?.email) return;

    try {
      const response = await apiRequest(
        `/api/applications/${encodeURIComponent(user.email)}`
      );

      setApplications(await response.json());
      setShowApplications(true);
    } catch (err) {
      alert(err.message || "Applications could not be loaded");
    }
  };

  // Post a job
  const handlePostJob = async () => {
    if (!jobTitle.trim() || !jobCompany.trim() ||
        !jobLocation.trim() || !jobSalary.trim() ||
        !jobDescription.trim() || !jobType || !experience) {
      alert("Please fill all required job details");
      return;
    }

    const jobData = {
      title: jobTitle.trim(),
      company: jobCompany.trim(),
      location: jobLocation.trim(),
      salary: jobSalary.trim(),
      description: jobDescription.trim(),
      jobType,
      experience,
      requirements: jobRequirements.trim(),
      employerEmail: user.email,
    };

    try {
      const response = await apiRequest("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      const newJob = await response.json();

      setJobs((previous) => [...previous, newJob]);
      setEmployerJobs((previous) => [...previous, newJob]);
      clearJobForm();
      alert("Job posted successfully!");
    } catch (err) {
      alert(err.message || "Job could not be posted");
    }
  };

  const clearJobForm = () => {
    setJobTitle("");
    setJobCompany("");
    setJobLocation("");
    setJobSalary("");
    setJobDescription("");
    setJobType("");
    setExperience("");
    setJobRequirements("");
  };

  // Get jobs posted by the logged-in employer
  const handleEmployerJobs = async () => {
    try {
      const response = await apiRequest(
        `/api/jobs/employer/${encodeURIComponent(user.email)}`
      );

      setEmployerJobs(await response.json());
    } catch (err) {
      alert(err.message || "Employer jobs could not be loaded");
    }
  };

  // Applications for a specific job
  const handleViewApplications = async (jobId) => {
    try {
      const response = await apiRequest(
        `/api/applications/job/${jobId}`
      );

      setEmployerApplications(await response.json());
      setShowEmployerDashboard(false);
      setShowEmployerApplications(true);
    } catch (err) {
      alert(err.message || "Applications could not be loaded");
    }
  };

  // Update an application's status
  const handleUpdateStatus = async (applicationId, status) => {
    try {
      const response = await apiRequest(
        `/api/applications/${applicationId}/status?status=${encodeURIComponent(status)}`,
        { method: "PUT" }
      );

      const updated = await response.json();

      setEmployerApplications((previous) =>
        previous.map((item) =>
          item.id === updated.id ? updated : item
        )
      );

      alert("Application status updated!");
    } catch (err) {
      alert(err.message || "Status update failed");
    }
  };

  // Delete a job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      await apiRequest(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      setJobs((previous) => previous.filter((job) => job.id !== jobId));
      setEmployerJobs((previous) =>
        previous.filter((job) => job.id !== jobId)
      );

      alert("Job deleted successfully!");
    } catch (err) {
      alert(err.message || "Job deletion failed");
    }
  };

  // Edit a job
  const handleEditJob = (job) => {
    setEditJob(job);
    setJobTitle(job.title || "");
    setJobCompany(job.company || "");
    setJobLocation(job.location || "");
    setJobSalary(job.salary || "");
    setJobDescription(job.description || "");
    setJobType(job.jobType || "");
    setExperience(job.experience || "");
    setJobRequirements(job.requirements || "");
    setShowEditJob(true);
  };

  // Save edited job
  const handleUpdateJob = async () => {
    if (!editJob) return;

    try {
      const response = await apiRequest(`/api/jobs/${editJob.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editJob,
          title: jobTitle.trim(),
          company: jobCompany.trim(),
          location: jobLocation.trim(),
          salary: jobSalary.trim(),
          description: jobDescription.trim(),
          jobType,
          experience,
          requirements: jobRequirements.trim(),
        }),
      });

      const updatedJob = await response.json();

      setJobs((previous) =>
        previous.map((job) =>
          job.id === updatedJob.id ? updatedJob : job
        )
      );

      setEmployerJobs((previous) =>
        previous.map((job) =>
          job.id === updatedJob.id ? updatedJob : job
        )
      );

      setShowEditJob(false);
      setEditJob(null);
      clearJobForm();
      alert("Job updated successfully!");
    } catch (err) {
      alert(err.message || "Job update failed");
    }
  };

  // Admin: view all users
  const handleViewUsers = async () => {
    try {
      const response = await apiRequest("/api/users");
      setUsers(await response.json());
      setShowUsers(true);
    } catch (err) {
      alert(err.message || "Users could not be loaded");
    }
  };

  // Admin: delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await apiRequest(`/api/users/${userId}`, {
        method: "DELETE",
      });

      setUsers((previous) =>
        previous.filter((item) => item.id !== userId)
      );

      alert("User deleted successfully!");
    } catch (err) {
      alert(err.message || "User deletion failed");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const title = (job.title || "").toLowerCase();
    const company = (job.company || "").toLowerCase();
    const location = (job.location || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      (title.includes(search) ||
        company.includes(search) ||
        location.includes(search)) &&
      (!locationFilter || job.location === locationFilter) &&
      (!jobTypeFilter || job.jobType === jobTypeFilter) &&
      (!experienceFilter || job.experience === experienceFilter)
    );
  });

  // Job details page
  if (showJobDetails && selectedJob) {
    return (
      <div className="app">
        <JobDetails
          job={selectedJob}
          onBack={() => {
            setShowJobDetails(false);
            setSelectedJob(null);
          }}
          onApply={() => setShowJobDetails(false)}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <nav>
        <h2>JobPortal</h2>
        <div>
          {user ? (
            <>
              <span>Welcome, {user.name}</span>

              {user.role === "Job Seeker" && (
                <button onClick={handleMyApplications}>My Applications</button>
              )}

              {user.role === "Employer" && (
                <button onClick={async () => {
                  await handleEmployerJobs();
                  setShowEmployerDashboard(true);
                }}>
                  Employer Dashboard
                </button>
              )}

              {user.role === "Admin" && (
                <button onClick={() => setShowAdminDashboard(true)}>
                  Admin Dashboard
                </button>
              )}

              <button onClick={() => {
                setUser(null);
                setEmployerJobs([]);
                setApplications([]);
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)}>Login</button>
              <button onClick={() => setShowRegister(true)}>Register</button>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <h1>Find Your Dream Job</h1>
        <p>Search and apply for your dream job easily.</p>

        <div className="search-box">
          <input
            placeholder="Search by job title, company or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => {}}>Search</button>
        </div>

        <div className="filters">
          <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
            <option value="">All Locations</option>
            {[...new Set(jobs.map((job) => job.location).filter(Boolean))].map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)}>
            <option value="">All Job Types</option>
            {[...new Set(jobs.map((job) => job.jobType).filter(Boolean))].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)}>
            <option value="">All Experience</option>
            {[...new Set(jobs.map((job) => job.experience).filter(Boolean))].map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="jobs-section">
        <h2>Latest Jobs</h2>
        <div className="job-container">
          {loading ? (
            <h3>Loading jobs...</h3>
          ) : error ? (
            <h3 className="error-message">{error}</h3>
          ) : filteredJobs.length ? (
            filteredJobs.map((job) => (
              <div className="job-card" key={job.id}>
                <h3>{job.title}</h3>
                <p>🏢 {job.company}</p>
                <p>📍 {job.location}</p>
                <p>💰 {job.salary}</p>
                <button onClick={() => {
                  setSelectedJob(job);
                  setShowJobDetails(true);
                }}>
                  View Details
                </button>
                <button onClick={() => {
                  setSelectedJob(job);
                  setShowJobDetails(false);
                }}>
                  Apply Now
                </button>
              </div>
            ))
          ) : (
            <h3>No jobs found</h3>
          )}
        </div>
      </div>

      {/* Login */}
      {showLogin && (
        <div className="login-overlay">
          <div className="login-box">
            <h2>Login</h2>
            <input type="email" placeholder="Enter Email" value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)} />
            <input type="password" placeholder="Enter Password" value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <button onClick={() => {
              setShowLogin(false);
              setShowForgotPassword(true);
            }}>Forgot Password?</button>
            <button onClick={() => setShowLogin(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Forgot password */}
      {showForgotPassword && (
        <div className="login-overlay">
          <div className="login-box">
            <h2>Forgot Password</h2>
            <input type="email" placeholder="Enter your email" value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)} />
            <input type="password" placeholder="Enter new password" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} />
            <button onClick={handleForgotPassword}>Reset Password</button>
            <button onClick={() => {
              setShowForgotPassword(false);
              setShowLogin(true);
            }}>Back to Login</button>
          </div>
        </div>
      )}

      {/* Register */}
      {showRegister && (
        <div className="login-overlay">
          <div className="login-box">
            <h2>Create Account</h2>
            <input placeholder="Full Name" value={registerName}
              onChange={(e) => setRegisterName(e.target.value)} />
            <input type="email" placeholder="Enter Email" value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)} />
            <input type="password" placeholder="Create Password" value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)} />
            <select value={registerRole} onChange={(e) => setRegisterRole(e.target.value)}>
              <option value="">Select Role</option>
              <option value="Job Seeker">Job Seeker</option>
              <option value="Employer">Employer</option>
            </select>
            <button onClick={handleRegister}>Register</button>
            <button onClick={() => setShowRegister(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Apply */}
      {selectedJob && !showJobDetails && (
        <div className="login-overlay">
          <div className="login-box">
            <h2>Apply for Job</h2>
            <h3>{selectedJob.title}</h3>
            <p>Company: {selectedJob.company}</p>
            <p>Location: {selectedJob.location}</p>
            <input placeholder="Your Full Name" value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)} />
            <input type="email" placeholder="Your Email" value={applicantEmail}
              onChange={(e) => setApplicantEmail(e.target.value)} />
            <input type="file" accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files?.[0] || null)} />
            <button onClick={handleApply}>Submit Application</button>
            <button onClick={() => setSelectedJob(null)}>Close</button>
          </div>
        </div>
      )}

      {/* My Applications */}
      {showApplications && (
        <div className="login-overlay">
          <div className="login-box applications-box">
            <h2>My Applications</h2>
            {applications.length ? applications.map((item) => (
              <div className="application-card" key={item.id}>
                <h3>{item.jobTitle}</h3>
                <p>Status: {item.status || "Pending"}</p>
                <p>Applicant: {item.applicantName}</p>
                <p>Email: {item.applicantEmail}</p>
                <p>Resume: {item.resumeName}</p>
              </div>
            )) : <p>You have not applied for any job yet.</p>}
            <button onClick={() => setShowApplications(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Employer applications */}
      {showEmployerApplications && (
        <div className="login-overlay">
          <div className="login-box applications-box">
            <h2>Job Applications</h2>
            {employerApplications.length ? employerApplications.map((item) => (
              <div className="application-card" key={item.id}>
                <h3>{item.applicantName}</h3>
                <p>Email: {item.applicantEmail}</p>
                <p>Resume: {item.resumeName}</p>
                <button onClick={() => window.open(
                  `${API_URL}/api/applications/resume/${encodeURIComponent(item.resumeName)}`,
                  "_blank"
                )}>
                  Download Resume
                </button>
                <p>Current Status: {item.status || "Pending"}</p>
                <select value={item.status || "Pending"}
                  onChange={(e) => handleUpdateStatus(item.id, e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            )) : <p>No applications received yet.</p>}
            <button onClick={() => {
              setShowEmployerApplications(false);
              setShowEmployerDashboard(true);
            }}>Back</button>
            <button onClick={() => setShowEmployerApplications(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Employer dashboard */}
      {showEmployerDashboard && (
        <div className="login-overlay">
          <div className="login-box applications-box">
            <h2>Employer Dashboard</h2>
            <h3>Post New Job</h3>
            <input placeholder="Job Title" value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)} />
            <input placeholder="Company Name" value={jobCompany}
              onChange={(e) => setJobCompany(e.target.value)} />
            <input placeholder="Location" value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)} />
            <input placeholder="Salary" value={jobSalary}
              onChange={(e) => setJobSalary(e.target.value)} />
            <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option value="">Select Job Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
            <select value={experience} onChange={(e) => setExperience(e.target.value)}>
              <option value="">Select Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="1-2 Years">1-2 Years</option>
              <option value="3-5 Years">3-5 Years</option>
              <option value="5+ Years">5+ Years</option>
            </select>
            <textarea placeholder="Job Description" value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)} />
            <textarea placeholder="Job Requirements" value={jobRequirements}
              onChange={(e) => setJobRequirements(e.target.value)} />
            <button onClick={handlePostJob}>Post Job</button>

            <hr />
            <h3>My Posted Jobs</h3>
            {employerJobs.length ? employerJobs.map((job) => (
              <div className="application-card" key={job.id}>
                <h3>{job.title}</h3>
                <p>Company: {job.company}</p>
                <p>Location: {job.location}</p>
                <p>Salary: {job.salary}</p>
                <button onClick={() => handleViewApplications(job.id)}>View Applications</button>
                <button onClick={() => handleEditJob(job)}>Edit</button>
                <button onClick={() => handleDeleteJob(job.id)}>Delete</button>
              </div>
            )) : <p>You have not posted any jobs yet.</p>}

            <button onClick={async () => {
              await handleEmployerJobs();
            }}>Refresh My Jobs</button>
            <button onClick={() => setShowEmployerDashboard(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Edit job */}
      {showEditJob && (
        <div className="login-overlay">
          <div className="login-box">
            <h2>Edit Job</h2>
            <input placeholder="Job Title" value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)} />
            <input placeholder="Company Name" value={jobCompany}
              onChange={(e) => setJobCompany(e.target.value)} />
            <input placeholder="Location" value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)} />
            <input placeholder="Salary" value={jobSalary}
              onChange={(e) => setJobSalary(e.target.value)} />
            <textarea placeholder="Job Description" value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)} />
            <textarea placeholder="Job Requirements" value={jobRequirements}
              onChange={(e) => setJobRequirements(e.target.value)} />
            <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option value="">Select Job Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
            <select value={experience} onChange={(e) => setExperience(e.target.value)}>
              <option value="">Select Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="1-2 Years">1-2 Years</option>
              <option value="3-5 Years">3-5 Years</option>
              <option value="5+ Years">5+ Years</option>
            </select>
            <button onClick={handleUpdateJob}>Save Changes</button>
            <button onClick={() => {
              setShowEditJob(false);
              setEditJob(null);
              clearJobForm();
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Admin dashboard */}
      {showAdminDashboard && (
        <div className="login-overlay">
          <div className="login-box applications-box">
            <h2>Admin Dashboard</h2>
            <button onClick={handleViewUsers}>View All Users</button>
            {showUsers && (
              <>
                <hr />
                <h3>All Users</h3>
                {users.length ? users.map((item) => (
                  <div className="application-card" key={item.id}>
                    <h3>{item.name}</h3>
                    <p>Email: {item.email}</p>
                    <p>Role: {item.role}</p>
                    <button onClick={() => handleDeleteUser(item.id)}>Delete User</button>
                  </div>
                )) : <p>No users found</p>}
              </>
            )}
            <h3>All Jobs</h3>
            {jobs.length ? jobs.map((job) => (
              <div className="application-card" key={job.id}>
                <h3>{job.title}</h3>
                <p>Company: {job.company}</p>
                <p>Location: {job.location}</p>
                <p>Employer: {job.employerEmail}</p>
                <button onClick={() => handleDeleteJob(job.id)}>Delete Job</button>
              </div>
            )) : <p>No jobs available</p>}
            <button onClick={() => setShowAdminDashboard(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
