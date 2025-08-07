import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import './App.css';

// Main Landing Page
function MainLanding() {
  const navigate = useNavigate();
  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">MultiRole Portal</div>
        <div className="navbar-links">
          <span className="navbar-center">
            <a href="#home">Home</a>
            <span className="nav-sep">|</span>
            <a href="#about">About</a>
          </span>
        </div>
      </nav>
      <section className="hero-section" id="home">
        <div className="hero-left">
          <img
            src="/generated-image.png"
            className="branding-illustration"
            alt="Company Illustration"
          />
        </div>
        <div className="hero-right">
          <h1>
            Welcome to <span className="highlight-word">MultiRole Portal Ecosystem</span>
          </h1>
          <p className="hero-desc">
            <span className="company-badge">Your all-in-one portal ecosystem</span>
            <br />
            Streamline, connect, and manage your company—effortlessly.
          </p>
          <button className="get-started-btn" onClick={() => navigate('/portals')}>
            Get Started
          </button>
        </div>
      </section>
      <section className="about-section" id="about">
        <h2>About this project</h2>
        <p>
          Made with ❤️ by <span className="about-author">Saurav</span>
        </p>
        <p className="about-note">
          This website is a demo for multi-portal enterprise cloud apps.
        </p>
      </section>
    </>
  );
}

// Portal selection page, now 100% centered, spread-out and responsive
function PortalsPage() {
  return (
    <div className="portals-full-bg">
      <div className="portals-full-center">
        <h1 className="portals-title">
          Welcome to <span className="portals-gradient">MultiRole Portal</span>
        </h1>
        <h3 className="portals-sub">Choose your portal</h3>
        <div className="portals-btns-column">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="large-portal-btn user"
          >
            👤 User Portal
            <span className="portal-btn-desc">Staff • Employees</span>
          </a>
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noopener noreferrer"
            className="large-portal-btn company"
          >
            🏢 Company Admin Portal
            <span className="portal-btn-desc">Company Management</span>
          </a>
          <a
            href="http://localhost:5175"
            target="_blank"
            rel="noopener noreferrer"
            className="large-portal-btn platform"
          >
            ⚙️ Platform Admin Portal
            <span className="portal-btn-desc">Super Admins</span>
          </a>
        </div>
        <Link to="/" className="back-to-home-link">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/portals" element={<PortalsPage />} />
        <Route path="/" element={<MainLanding />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
