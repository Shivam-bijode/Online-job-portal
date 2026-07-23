function JobDetails({ job, onBack, onApply }) {
  return (
    <div className="job-details-page">

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to Jobs
      </button>

      <div className="job-details-card">

        <h1>{job.title}</h1>

        <h2>{job.company}</h2>

        <p>
          📍 <strong>Location:</strong>{" "}
          {job.location}
        </p>

        <p>
          💰 <strong>Salary:</strong>{" "}
          {job.salary}
        </p>

        <p>
          💼 <strong>Job Type:</strong>{" "}
          {job.jobType}
        </p>

        <p>
          🎓 <strong>Experience:</strong>{" "}
          {job.experience}
        </p>

        <hr />

        <h2>Job Description</h2>

        <p>
          {job.description}
        </p>

        <h2>Requirements</h2>

       <p>
         {job.requirements}
       </p>

        <button
          className="apply-details-button"
          onClick={onApply}
        >
          Apply Now
        </button>

      </div>

    </div>
  );
}

export default JobDetails;