import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/Api";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader/Loader";
import "./HostelDatail.css";

function HostelDetail() {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

     const fetchHostel = async () => {
      try {
        const res = await api.get(`/hostels/${id}`);

        console.log(res.data);
        console.log(res.data.images)

        setHostel(res.data);
      } catch (err) {
        console.error("Failed to fetch hostel:", err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchHostel();
  }, [id]);

  if (loading) return <Loader text="Loading hostel details..." />;

  if (!hostel) {
    return (
      <div>
        <Navbar />
        <p className="not-found">Hostel not found.</p>
      </div>
    );
  }

  const images = hostel.images?.length ? hostel.images : [""];

  return (
    <div className="hostel-detail-page">
      <Navbar />

      <div className="detail-container">
        <div className="gallery">
          <img src={images[activeImage]} alt={hostel.name} className="gallery-main" />
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className={`gallery-thumb ${idx === activeImage ? "active" : ""}`}
                  onClick={() => setActiveImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <h1>{hostel.name}</h1>
          <p className="detail-address">
            {hostel.address}, {hostel.city}
          </p>
          <p className="detail-description">{hostel.description}</p>

          <div className="price-cards">
            <div className="price-card">
              <p className="price-label">Single Room</p>
              <p className="price-value">Rs. {hostel.singleRoomPrice}/month</p>
            </div>
            <div className="price-card">
              <p className="price-label">Shared Room</p>
              <p className="price-value">Rs. {hostel.sharedRoomPrice}/month</p>
            </div>
          </div>

          <Link to={`/book/${hostel._id}`} className="book-btn">
            Book This Hostel
          </Link>
        </div>
      </div>
    </div>
  );
}


export default HostelDetail;