import api from "../../services/Api";
import { useState,useEffect } from "react";
import { Link , useLocation } from "react-router-dom";
import "./Landing.css";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader/Loader";
import { getImageUrl } from "../../utils/imageUrl";
function Landing(){

  const [hostels , setHostels] = useState([]);
  const [loading , setLoading] = useState(true)
   const location = useLocation();

  const fetchHostels = async () => {
       try {
        const res = await api.get("/hostels/all");
        setHostels(res.data);
      } catch (err) {
        console.error("Failed to fetch hostels:", err);
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
      fetchHostels();
}, [])
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return(
    <>
    <div className="landing-page">
      <Navbar/>

        {loading && <Loader text="Loading Hostels..." />}

<section className="hero">
  <div className="hero-overlay"></div>
  <div className="hero-content">
    <h1>Find Your Perfect Hostel Stay</h1>
    <p>
      Comfortable, affordable, and safe hostel accommodations across
      multiple cities — book your room in minutes.
    </p>
    <Link to="/book" className="hero-btn">
      Book Now
    </Link>
  </div>
</section>

       <section className="hostels-section" id="hostels-section">
        <h2>Our Hostels</h2>
        <p className="section-subtitle">
          Choose from our network of trusted hostel branches
        </p>

        {!loading && hostels.length === 0 && (
          <p className="no-hostels">No hostels available right now.</p>
        )}

        <div className="hostels-grid">
          {hostels.map((hostel) => (
            <div className="hostel-card" key={hostel._id}>
              <img
  src={
    hostel.images?.[0]
      ? getImageUrl(hostel.images[0])
      : "https://via.placeholder.com/300x200"
  }
  alt={hostel.name}
  className="hostel-card-img"
/>
              <div className="hostel-card-body">
                <h3>{hostel.name}</h3>
                <p className="hostel-city">{hostel.city}</p>
                <p className="hostel-price">
                  From Rs. {Math.min(hostel.singleRoomPrice, hostel.sharedRoomPrice)}
                  /month
                </p>
                <Link to={`/hostels/${hostel._id}`} className="hostel-view-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section> 


       <section className="reviews-section" id="reviews-section">
        <h2>What Our Students Say</h2>
        <div className="reviews-grid">
          <div className="review-card">
            <p className="review-text">
              "Great place to stay, very clean rooms and helpful staff.
              Made my university life so much easier."
            </p>
            <p className="review-author">— Ayesha K.</p>
          </div>
          <div className="review-card">
            <p className="review-text">
              "Affordable and safe. The booking process was super smooth
              and quick."
            </p>
            <p className="review-author">— Bilal R.</p>
          </div>
          <div className="review-card">
            <p className="review-text">
              "Best decision for my hostel stay. Highly recommend to
              fellow students."
            </p>
            <p className="review-author">— Sara M.</p>
          </div>
        </div>
      </section>

           <footer className="footer" id="footer-section">

    <div className="footer-content">

        <div className="footer-section">
            <h3>Elite Hostels</h3>
            <p>Safe & Affordable Student Accommodation</p>
        </div>

        <div className="footer-section">
            <h3>Contact</h3>
            <p>📞 +92 300 1234567</p>
            <p>📧 info@elitehostels.com</p>
            <p>📍 Karachi, Pakistan</p>
        </div>

        <div className="footer-section">
            <h3>Quick Links</h3>
            <p><Link to="/"  onClick={() => window.scrollTo({top: 0 , behavior: "smooth"})}>Home</Link></p>
    <p> <a href="#hostels-section">Hostels</a></p>
    <p><Link to="/book">Book Now</Link></p>
        </div>

    </div>

    <hr />

    <p>© {new Date().getFullYear()} Elite Hostels. All Rights Reserved.</p>

</footer>
    </div>
    </>
  )
}
export default Landing;

