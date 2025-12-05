import React from 'react';
import '../styles/landing.css';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <h1>MentorMatch</h1>
        <p>Connect with the best mentors and accelerate your learning journey!</p>
        <div className="cta-buttons">
          <Link to="/register">Join Now</Link>
          <Link to="/login">Login</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <h3>Personalized Mentorship</h3>
          <p>Find mentors that match your goals and learning style.</p>
        </div>
        <div className="feature-card">
          <h3>Flexible Scheduling</h3>
          <p>Book sessions that fit your timetable easily and efficiently.</p>
        </div>
        <div className="feature-card">
          <h3>Track Progress</h3>
          <p>Monitor your growth and milestones with structured mentorship.</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Students Say</h2>
        <div className="testimonial-card">
          <p>"MentorMatch helped me find the perfect mentor for my career path!"</p>
          <h4>- Sarah K.</h4>
        </div>
        <div className="testimonial-card">
          <p>"Booking sessions is so easy, and my mentor is amazing!"</p>
          <h4>- John D.</h4>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 MentorMatch. All rights reserved.</p>
        <p>
          Follow us on <a href="#">Twitter</a> | <a href="#">LinkedIn</a>
        </p>
      </footer>
    </>
  );
}

export default Landing;
