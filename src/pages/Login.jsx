import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import '../styles/auth.css';

// 1. We destructure 'setAuth' from props so we can update App.js
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };

      // 2. Direct call to your Backend
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      // 3. Parse the JSON response
      const parseRes = await response.json();

      if (response.ok) {
        // SUCCESS CASE
        // A. Save the token to browser memory
        localStorage.setItem("token", parseRes.token);
        
        // B. Tell App.js "User is logged in"
        

        alert('Login Successful!');
        navigate('/dashboard');
      } else {
        // FAILURE CASE (e.g., Wrong password)
        alert(parseRes || 'Login failed');
      }
    } catch (err) {
      console.error(err.message);
      alert("Server connection failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      <div className="link">
        {/* Use Link to stop page refresh */}
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Login;