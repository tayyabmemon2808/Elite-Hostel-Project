import { useState, useEffect } from "react";
import api from "../../services/Api";
import { getUser } from "../../utils/auth";
import Loader from "../../components/Loader/Loader";

function MyRoom() {
  const user = getUser();
  const userId = user._id || user.id;

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/my-room/${userId}`);
        setRoom(res.data);
      } catch (err) {
        console.error("Failed to fetch room:", err);
        setRoom(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, []);

  if (loading) return <Loader text="Loading your room..." />;

  if (!room) {
    return (
      <div className="empty-state">
        <p>You haven't been allotted a room yet.</p>
        <p className="empty-state-sub">
          Please contact your hostel administration once your booking is
          approved.
        </p>
      </div>
    );
  }

  return (
    <div className="my-room-info">
      <div className="room-header">
        <h3>Room {room.roomNumber}</h3>
        <span className="room-type-badge">{room.roomType}</span>
      </div>

      <p className="room-hostel-name">{room.hostel?.name}</p>
      <p className="room-hostel-city">{room.hostel?.city}</p>

      <div className="roommates-section">
        <h4>Roommates</h4>

        {room.studentsAllotted &&
        room.studentsAllotted.filter(
          (s) => s._id.toString() !== userId.toString(),
        ).length > 0 ? (
          <ul className="roommates-list">
            {room.studentsAllotted
              .filter((s) => s._id.toString() !== userId.toString())
              .map((s) => (
                <li key={s._id}>
                  {s.name} — {s.email}
                </li>
              ))}
          </ul>
        ) : (
          <p className="no-roommates">No roommates currently.</p>
        )}
      </div>
    </div>
  );
}

export default MyRoom;
