import { useState } from "react";
import axios from "axios";
import { FaUserCircle, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.svg";
import Loader from "./Loader";

function Navbar({ title }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showProfile, setShowProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Please wait...");
  const [success, setSuccess] = useState(false);

  const handleLogout = () => {
    setLoadingText("Logging out...");
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }, 1200);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoadingText("Updating profile...");
    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/auth/update/${user.id}`,
        { name, email }
      );

      const updatedUser = {
        ...user,
        name: response.data.user.name,
        email: response.data.user.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setEditMode(false);
      }, 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  if (loading) return <Loader text={loadingText} />;

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Elite Hostel Logo" className="logo-img" />
        <div>
          <div className="navbar-brand">Elite Hostel</div>
          <div className="navbar-title">{title}</div>
        </div>
      </div>

      <div className="navbar-right">
        <FaUserCircle
          className="profile-icon"
          onClick={() => setShowProfile(!showProfile)}
        />
        <button onClick={handleLogout}>Logout</button>
      </div>

      {success && (
        <div className="loader-overlay">
          <div className="success-box">
            <p>✅ Profile updated successfully!</p>
          </div>
        </div>
      )}

      {showProfile && (
        <div
          className="profile-modal-overlay"
          onClick={() => setShowProfile(false)}
        >
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <FaTimes
              className="close-icon"
              onClick={() => setShowProfile(false)}
            />

            <FaUserCircle className="profile-avatar" />

            {message && <p>{message}</p>}

            {!editMode ? (
              <>
                <h3>{user.name}</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                {user.block && <p><strong>Block:</strong> {user.block}</p>}
                <button onClick={() => setEditMode(true)}>Edit Profile</button>
              </>
            ) : (
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                <button type="submit">Save Changes</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setName(user.name);
                    setEmail(user.email);
                    setEditMode(false);
                  }}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;