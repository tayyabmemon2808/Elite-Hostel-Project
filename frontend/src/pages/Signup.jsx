import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import Loader from '../components/Loader';
import logo from '../assets/logo.svg'

function Signup() {
  const [signupType, setSignupType] = useState('student'); 
  const [staffRole, setStaffRole] = useState('subadmin'); 

  const [formData, setFormData] = useState({
    referenceId: '',
    name: '',
    email: '',
    password: '',
    hostel: ''
  });

  const [hostels, setHostels] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

 
  useEffect(() => {
    if (signupType === 'staff' && staffRole === 'subadmin') {
      axios.get('http://localhost:3000/api/hostels/all')
        .then(res => setHostels(res.data))
        .catch(() => setHostels([]));
    }
  }, [signupType, staffRole]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

   
    let payload = { password: formData.password };

    if (signupType === 'student') {
      payload.referenceId = formData.referenceId;
      payload.role = 'student';
    } else {
      payload.name = formData.name;
      payload.email = formData.email;
      payload.role = staffRole;
      if (staffRole === 'subadmin') {
        payload.hostel = formData.hostel;
      }
    }

    try {
      await axios.post('http://localhost:3000/api/auth/signup', payload);

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 1200);

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Creating account..." />;

  if (success) {
    return (
      <div className="loader-overlay">
        <div className="success-box">
          <FaCheckCircle className="success-icon" />
          <p>Account created successfully!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="Elite Hostel Logo" className="auth-logo-img" />
        <h1 className="auth-brand">Elite Hostel</h1>
        <h2>Create Account</h2>
        <p className="auth-subtitle">Sign up for Elite Hostel Account</p>

        {error && <p className="error-text">{error}</p>}

       
        <select
          value={signupType}
          onChange={(e) => setSignupType(e.target.value)}
        >
          <option value="student">Student (via Booking Reference ID)</option>
          <option value="staff">Staff (Super Admin / Sub Admin)</option>
        </select>

        <form onSubmit={handleSubmit}>

          {signupType === 'student' && (
            <input
              type="text"
              name="referenceId"
              placeholder="Booking Reference ID (e.g. BK-XXXXXXX)"
              value={formData.referenceId}
              onChange={handleChange}
            />
          )}

          {signupType === 'staff' && (
            <>
              <select
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value)}
              >
                <option value="subadmin">Sub Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />

              {staffRole === 'subadmin' && (
                <select name="hostel" value={formData.hostel} onChange={handleChange}>
                  <option value="">Select Hostel</option>
                  {hostels.map(h => (
                    <option key={h._id} value={h._id}>{h.name} — {h.city}</option>
                  ))}
                </select>
              )}
            </>
          )}

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

          <button type="submit">Sign Up</button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;