import { useState, useEffect } from "react";
import api from "../../services/Api";
import { getUser } from "../../utils/auth";
import Loader from "../../components/Loader/Loader";

function MyStayHistory() {
  const user = getUser();
  const userId = user._id || user.id;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/stay-history/my-history/${userId}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch stay history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (d) => {
    if (!d) return "Currently staying";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) return <Loader text="Loading stay history..." />;

  return (
    <div>
      <h3 className="tab-heading">My Stay History</h3>

      {history.length === 0 ? (
        <div className="empty-state">
          <p>No stay history found.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((h) => (
            <div className="history-card" key={h._id}>
              <div className="history-top">
                <h4>{h.hostel?.name}</h4>
                <span
                  className={
                    h.checkOutDate ? "status-tag status-resolved" : "status-tag status-pending"
                  }
                >
                  {h.checkOutDate ? "Completed" : "Currently staying"}
                </span>
              </div>
              <p className="history-detail">Room: {h.room?.roomNumber}</p>
              <p className="history-detail">
                {formatDate(h.checkInDate)} — {formatDate(h.checkOutDate)}
              </p>

              {h.roommates && h.roommates.length > 0 && (
                <div className="history-roommates">
                  <p className="reply-label">Roommates at the time:</p>
                  <ul>
                    {h.roommates.map((r) => (
                      <li key={r._id}>
                        {r.name} — {r.email}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyStayHistory;