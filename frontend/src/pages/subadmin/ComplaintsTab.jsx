import { useState, useEffect } from "react";
import api from "../../services/Api";
import { getUser } from "../../utils/auth";
import Loader from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";

function ComplaintsTab() {
  const user = getUser();
  const userId = user._id || user.id;
  const hostelId = user.hostel?._id || user.hostel;

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [replyDrafts, setReplyDrafts] = useState({});

  const showTempSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const showTempError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3500);
  };

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/complaints/hostel/${hostelId}`);
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

  const handleReplyChange = (id, value) => {
    setReplyDrafts({ ...replyDrafts, [id]: value });
  };

  const handleResolve = async (id) => {
    const adminReply = replyDrafts[id];
    if (!adminReply || !adminReply.trim()) {
      showTempError("Please write a reply before resolving.");
      return;
    }

    setActionLoading(true);
    try {
      await api.put(`/complaints/resolve/${id}`, { adminReply });
      showTempSuccess("Complaint resolved successfully!");
      await fetchComplaints();
    } catch (err) {
      showTempError(err.response?.data?.message || "Failed to resolve complaint.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader text="Loading complaints..." />;

  const pending = complaints.filter((c) => c.status === "pending");
  const resolved = complaints.filter((c) => c.status === "resolved");

  return (
    <div>
      {actionLoading && <Loader text="Please wait..." />}
      <Error message={error} type="error" />
      <Error message={success} type="success" />

      <h3 className="tab-heading">Complaints</h3>

      {complaints.length === 0 ? (
        <div className="empty-state">
          <p>No complaints filed yet.</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="rooms-section">
              <h4 className="group-title">Pending ({pending.length})</h4>
              <div className="complaints-list">
                {pending.map((c) => (
                  <div className="complaint-card" key={c._id}>
                    <div className="complaint-top">
                      <div>
                        <h4>{c.title}</h4>
                        <p className="booking-ref">
                          {c.student?.name} — {c.student?.email}
                        </p>
                      </div>
                      <span className="status-tag status-pending">pending</span>
                    </div>
                    <p className="complaint-desc">{c.description}</p>

                    <textarea
                      className="reply-textarea"
                      placeholder="Write your reply..."
                      rows="3"
                      value={replyDrafts[c._id] || ""}
                      onChange={(e) => handleReplyChange(c._id, e.target.value)}
                    />

                    <button
                      className="approve-btn"
                      onClick={() => handleResolve(c._id)}
                    >
                      Resolve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resolved.length > 0 && (
            <div className="rooms-section">
              <h4 className="group-title">Resolved ({resolved.length})</h4>
              <div className="complaints-list">
                {resolved.map((c) => (
                  <div className="complaint-card" key={c._id}>
                    <div className="complaint-top">
                      <div>
                        <h4>{c.title}</h4>
                        <p className="booking-ref">
                          {c.student?.name} — {c.student?.email}
                        </p>
                      </div>
                      <span className="status-tag status-resolved">resolved</span>
                    </div>
                    <p className="complaint-desc">{c.description}</p>
                    <div className="complaint-reply">
                      <p className="reply-label">Your Reply:</p>
                      <p className="reply-text">{c.adminReply}</p>
                      {c.studentRating && (
                        <p className="rated-text">
                          Student rated: {c.studentRating} ★
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ComplaintsTab;