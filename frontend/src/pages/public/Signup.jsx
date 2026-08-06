import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import api from "../../services/Api";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader/Loader";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    referenceId: searchParams.get("referenceId") || "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/signup", {
        role: "student",
        referenceId: formData.referenceId.trim(),
        password: formData.password,
      });

      navigate("/login", {
        state: { successMessage: "Account created! Please login to continue." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please check your reference ID."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Navbar />

      {loading && <Loader text="Creating your account..." />}

      <div className="signup-container">
        <div className="signup-box">
          <h2>Student Signup</h2>
          <p className="signup-subtitle">
            Complete your signup using your approved booking reference ID
          </p>

          {error && <div className="signup-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Reference ID</label>
              <input
                type="text"
                name="referenceId"
                placeholder="e.g. BK-K6JM2UA"
                value={formData.referenceId}
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
                  {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <IoEyeOffOutline size={18} />
                  ) : (
                    <IoEyeOutline size={18} />
                  )}
                </span>
              </div>
            </div>

            <button type="submit" className="signup-btn">
              Create Account
            </button>
          </form>

          <p className="signup-footer-text">
            Don't have a reference ID?{" "}
            <Link to="/book">Book a room first</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;