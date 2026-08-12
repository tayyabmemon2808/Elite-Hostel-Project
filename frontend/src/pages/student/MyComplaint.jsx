import { useState, useEffect } from "react";
import api from "../../services/Api";
import { getUser } from "../../utils/auth";
import Loader from "../../components/Loader/Loader";

function MyComplaints() {
  const user = getUser();
  const userId = user._id || user.id;

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState({});

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/complaints/my-complaints/${userId}`);
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleReopen = async (id) => {
    setActionLoading(true);
    try {
      await api.put(`/complaints/reopen/${id}`);
      await fetchComplaints();
    } catch (err) {
      console.error("Failed to reopen:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRate = async (id) => {
    const rating = selectedRatings[id];
    if (!rating) return;

    setActionLoading(true);
    try {
      await api.put(`/complaints/rate/${id}`, { studentRating: rating });
      await fetchComplaints();
    } catch (err) {
      console.error("Failed to rate:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStarClick = (id, star) => {
    setSelectedRatings({ ...selectedRatings, [id]: star });
  };

  if (loading) return <Loader text="Loading complaints..." />;

  return (
    <div>
      {actionLoading && <Loader text="Please wait..." />}

      <h3 className="tab-heading">My Complaints</h3>

      {complaints.length === 0 ? (
        <div className="empty-state">
          <p>You haven't filed any complaints yet.</p>
        </div>
      ) : (
        <div className="complaints-list">
          {complaints.map((c) => (
            <div className="complaint-card" key={c._id}>
              <div className="complaint-top">
                <h4>{c.title}</h4>
                <span className={`status-tag status-${c.status}`}>
                  {c.status}
                </span>
              </div>
              <p className="complaint-desc">{c.description}</p>

              {c.status === "resolved" && (
                <div className="complaint-reply">
                  <p className="reply-label">Admin Reply:</p>
                  <p className="reply-text">{c.adminReply}</p>

                  <div className="complaint-actions">
                    {!c.studentRating ? (
                      <div className="rating-input">
                        <span>Rate this resolution:</span>
                        <div className="stars-row">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              className="star-btn"
                              onClick={() => handleStarClick(c._id, star)}
                            >
                              {(selectedRatings[c._id] || 0) >= star
                                ? "★"
                                : "☆"}
                            </button>
                          ))}
                        </div>
                        {selectedRatings[c._id] && (
                          <button
                            className="confirm-rating-btn"
                            onClick={() => handleRate(c._id)}
                          >
                            Submit Rating
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="rated-text">
                        You rated: {c.studentRating} ★
                      </p>
                    )}

                    <button
                      className="reopen-btn"
                      onClick={() => handleReopen(c._id)}
                    >
                      Not satisfied? Reopen
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyComplaints;
