import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import Loader from '../components/Loader';
import logo from '../assets/logo.svg'
function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    localStorage.removeItem('user');

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', formData);
      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        if (user.role === 'admin') navigate('/admin-dashboard');
        else if (user.role === 'warden') navigate('/warden-dashboard');
        else navigate('/student-dashboard');
      }, 1200);

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Logging in..." />;

  if (success) {
    return (
      <div className="loader-overlay">
        <div className="success-box">
          <FaCheckCircle className="success-icon" />
          <p>Login successful!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
       <img src={logo} alt="Elite Hostel Logo" className="auth-logo-img" />
<h1 className="auth-brand">Elite Hostel</h1>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to your Elite Hostel account</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;