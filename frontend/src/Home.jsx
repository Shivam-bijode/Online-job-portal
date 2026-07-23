import { useState } from "react";
import Login from "./Login";

function Home() {
    const [showLogin, setShowLogin] = useState(false);

    if (showLogin) {
      return <Login />;
    }
  const [message, setMessage] = useState("");

  const handleSearch = () => {
    setMessage("Jobs search ho rahi hain...");
  };

  const handleLogin = () => {
    setMessage("Login page baad mein banayenge");
  };

  const handleRegister = () => {
    setMessage("Register page baad mein banayenge");
  };

  return (
    <div className="home-page">

      {/* Navbar */}
      <nav className="navbar">
        <h2>JobPortal</h2>

        <div>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>Find Your Dream Job</h1>

        <p>
          Discover thousands of job opportunities and build your career.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Job title, skills or keywords"
          />

          <input
            type="text"
            placeholder="Location"
          />

          <button onClick={handleSearch}>
            Search Jobs
          </button>
        </div>

        {message && <p className="message">{message}</p>}
      </section>

      {/* Categories */}
      <section className="categories">
        <h2>Popular Job Categories</h2>

        <div className="category-container">

          <div
            className="category-card"
            onClick={() => setMessage("Software Developer jobs selected")}
          >
            💻 Software Developer
            <p>1200+ Jobs Available</p>
          </div>

          <div
            className="category-card"
            onClick={() => setMessage("UI/UX Designer jobs selected")}
          >
            🎨 UI/UX Designer
            <p>800+ Jobs Available</p>
          </div>

          <div
            className="category-card"
            onClick={() => setMessage("Marketing jobs selected")}
          >
            📊 Marketing
            <p>500+ Jobs Available</p>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;