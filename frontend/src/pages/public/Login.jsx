import { useState } from "react";
import { useNavigate, Link  } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import api from "../../services/Api";
import { setUser } from "../../utils/auth";
import Loader from "../../components/Loader/Loader";
import "./Login.css";
import logo from "../../assets/logo.svg"

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);
      const user = res.data.user;

      setUser(user);

      if (user.role === "superadmin") {
        navigate("/superadmin/dashboard");
      } else if (user.role === "subadmin") {
        navigate("/subadmin/dashboard");
      } else if (user.role === "student") {
        navigate("/student/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        {loading && <Loader text="Logging in..." />}

        <div className="login-box">
            <img src={logo} alt="Elite Hostels" className="login-logo" />
          <h2>Login</h2>
          <p className="login-subtitle">Welcome back! Please enter your details.</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={18} />
                  ) : (
                    <IoEyeOutline size={18} />
                  )}
                </span>
              </div>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <p className="login-footer-text">
            New here? <Link to="/book">Book a room to get started</Link>
          </p>
        </div>
      </div>
    </>
  );
}
export default Login;
