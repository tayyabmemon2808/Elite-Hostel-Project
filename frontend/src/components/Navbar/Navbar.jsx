import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
import logo from "../../assets/logo.svg";
import { getUser, clearUser } from "../../utils/auth";
import api from "../../services/Api";
import ProfileModal from "./ProfileModal";
import { getImageUrl } from "../../utils/imageUrl";
import "./Navbar.css";
function Navbar() {

  const navigate = useNavigate();
  const user = getUser();
  const [showProfileModal, setShowProfileModal] = useState(false)
   const [hostelName, setHostelName] = useState("");

  const fetchHostelName = async () => {
      if (user?.role === "subadmin" && user?.hostel) {
        const hostelId =
          typeof user.hostel === "object" ? user.hostel._id : user.hostel;
        try {
          const res = await api.get(`/hostels/${hostelId}`);
          setHostelName(res.data.name);
        } catch (err) {
          console.error("Failed to fetch hostel name:", err);
        }
      }
    };
    useEffect(() => {
      fetchHostelName();
    }, [])

    const handleLogout = () => {
    clearUser();
    navigate("/");
  };


  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/"  onClick={() => window.scrollTo({top: 0 , behavior: "smooth"})}>
          <img src={logo} alt="Elite Hostels Logo" className="navbar-logo" />
          <span>Elite Hostels</span>
        </Link>
      </div>
      {!user && (
      <div className="navbar-links">
        <Link to="/" onClick={() => window.scrollTo({top: 0 , behavior: "smooth"})}>Home</Link>
        <Link to="/#hostels-section">Hostels</Link>
    <Link to="/#reviews-section">Reviews</Link>
    <Link to="/#footer-section">Contact</Link>
       <Link to="/check-status">Check Status</Link>
      </div>
      )}

     
      {user ? (
  <div className="navbar-actions">
    {user.role === "subadmin" && hostelName && (
      <span className="navbar-hostel-tag">{hostelName}</span>
    )}
    <button
      className="navbar-profile-btn"
      onClick={() => setShowProfileModal(true)}
    >
      {user.profileImage ? (
        <img
          src={getImageUrl(user.profileImage)}
          alt="Profile"
          className="navbar-profile-img"
        />
      ) : (
        <IoPersonCircleOutline size={22} />
      )}
      {user.name}
    </button>
    <button className="btn-outline" onClick={handleLogout}>
      Logout
    </button>
  </div>
) : (
  <div className="navbar-actions">
    <Link to="/book" className="btn-primary">
      Book Now
    </Link>
    <Link to="/login" className="btn-outline">
      Login
    </Link>
    <Link to="/signup" className="btn-text">
      Signup
    </Link>
  </div>
)}

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </nav>
  );
}

export default Navbar;