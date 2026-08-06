import {Link} from "react-router-dom";
import logo from "../../assets/logo.svg";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/"  onClick={() => window.scrollTo({top: 0 , behavior: "smooth"})}>
          <img src={logo} alt="Elite Hostels Logo" className="navbar-logo" />
          <span>Elite Hostels</span>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/" onClick={() => window.scrollTo({top: 0 , behavior: "smooth"})}>Home</Link>
        <a href="#hostels-section">Hostels</a>
  <a href="#reviews-section">Reviews</a>
    <a href="#footer-section">Contact</a>
       <Link to="/check-status">Check Status</Link>
      </div>
      <div className="navbar-actions">
        <Link to="/book" className="btn-primary">
          Book Now
        </Link>
        <Link to="/login" className="btn-outline">
          Login
        </Link>
        <Link to="/signup" className="btn-text">Signup</Link>
      </div>
    </nav>
  );
}
export default Navbar;