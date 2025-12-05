import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for better routing
import '../styles/auth.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send the data to the Backend
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      // 2. Parse the JSON response
      const parseRes = await response.json();

      // 3. Check if the request was successful (Status code 200-299)
      if (response.ok) {
        // Success! The backend sent back the new user data
        alert('Registered successfully! Please Login.');
        navigate('/login'); // Redirect to login page
      } else {
        // Failure! The backend sent back an error string (e.g., "User already exists")
        alert(parseRes || 'Registration failed');
      }
    } catch (err) {
      console.error(err.message);
      alert('Server connection failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" placeholder="Full Name" 
          value={name} onChange={(e) => setName(e.target.value)} 
          required
        />
        <input 
          type="email" placeholder="Email" 
          value={email} onChange={(e) => setEmail(e.target.value)} 
          required
        />
        <input 
          type="password" placeholder="Password" 
          value={password} onChange={(e) => setPassword(e.target.value)} 
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <div className="link">
        {/* Use Link instead of <a href> to prevent page reload */}
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Register;