import { useState, useEffect } from "react";
import api from "../../services/Api";
import { getUser } from "../../utils/auth";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal/Modal";
import Error from "../../components/Error/Error";

// Backend chahe kisi bhi field naam se students bheje (students/occupants/allottedStudents),
// ye helper hamesha sahi array nikal ke deta hai
const getRoomStudents = (room) => {
  return (
    room.students ||
    room.occupants ||
    room.allottedStudents ||
    room.studentsAllotted ||
    []
  );
};

function RoomsTab() {
  const user = getUser();
  const userId = user._id || user.id;
  const hostelId = user.hostel?._id || user.hostel;

  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [addForm, setAddForm] = useState({
    roomNumber: "",
    roomType: "single",
    capacity: 1,
  });

  const [allotForm, setAllotForm] = useState({ roomId: "", studentId: "" });

  const [editingRoom, setEditingRoom] = useState(null);
  const [editForm, setEditForm] = useState({
    roomNumber: "",
    roomType: "single",
    capacity: 1,
  });

  const showTempSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const showTempError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, studentsRes] = await Promise.all([
        api.get(`/rooms/hostel/${hostelId}`),
        api.get("/auth/students"),
      ]);
      console.log("Rooms fetched from backend:", roomsRes.data); // debug — dekh lo console mein
      setRooms(roomsRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error("Failed to fetch rooms/students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add Room
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    if (name === "roomType" && value === "single") {
      setAddForm({ ...addForm, roomType: value, capacity: 1 });
    } else {
      setAddForm({ ...addForm, [name]: value });
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post("/rooms/add", { ...addForm, hostel: hostelId });
      setAddForm({ roomNumber: "", roomType: "single", capacity: 1 });
      showTempSuccess("Room added successfully!");
      await fetchData();
    } catch (err) {
      showTempError(err.response?.data?.message || "Failed to add room.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Room
  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await api.delete(`/rooms/${id}`);
      showTempSuccess("Room deleted.");
      await fetchData();
    } catch (err) {
      showTempError(err.response?.data?.message || "Failed to delete room.");
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Room
  const openEdit = (room) => {
    setEditingRoom(room);
    setEditForm({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      capacity: room.capacity,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "roomType" && value === "single") {
      setEditForm({ ...editForm, roomType: value, capacity: 1 });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.put(`/rooms/update/${editingRoom._id}`, {
        ...editForm,
        hostel: hostelId,
      });
      setEditingRoom(null);
      showTempSuccess("Room updated.");
      await fetchData();
    } catch (err) {
      showTempError(err.response?.data?.message || "Failed to update room.");
    } finally {
      setActionLoading(false);
    }
  };

  // Allot Room
  const handleAllotChange = (e) => {
    setAllotForm({ ...allotForm, [e.target.name]: e.target.value });
  };

  const handleAllotSubmit = async (e) => {
    e.preventDefault();
    if (!allotForm.roomId || !allotForm.studentId) return;

    setActionLoading(true);
    try {
      await api.post("/rooms/allot", allotForm);

      // OPTIMISTIC UPDATE: turant local state update karo, backend refetch ka wait mat karo.
      // Isse occupied count aur dropdown filtering turant sahi ho jayenge, chahe
      // backend ka GET /rooms/hostel response field naam kuch bhi ho.
      const allottedStudent = students.find((s) => s._id === allotForm.studentId);

      setRooms((prevRooms) =>
        prevRooms.map((r) => {
          if (r._id !== allotForm.roomId) return r;
          const currentStudents = getRoomStudents(r);
          return {
            ...r,
            students: [...currentStudents, allottedStudent],
          };
        })
      );

      setAllotForm({ roomId: "", studentId: "" });
      showTempSuccess("Student allotted successfully!");

      // Background mein bhi sync kar lo (agar backend field sahi hua to aur behtar match hoga)
      fetchData();
    } catch (err) {
      showTempError(err.response?.data?.message || "Failed to allot room.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatOccupancy = (room) => getRoomStudents(room);

  // Unoccupied students & available rooms
  const allottedStudentIds = new Set(
    rooms.flatMap((r) => formatOccupancy(r).map((s) => s._id))
  );
  const unallottedStudents = students.filter((s) => !allottedStudentIds.has(s._id));
  const availableRooms = rooms.filter(
    (r) => formatOccupancy(r).length < r.capacity
  );

  if (loading) return <Loader text="Loading rooms..." />;

  return (
    <div>
      {actionLoading && <Loader text="Please wait..." />}
<Error message={error} type="error" />
<Error message={success} type="success" />

      {/* Add Room */}
      <div className="rooms-section">
        <h3 className="tab-heading">Add Room</h3>
        <form onSubmit={handleAddSubmit} className="inline-form">
          <input
            type="text"
            name="roomNumber"
            placeholder="Room Number"
            value={addForm.roomNumber}
            onChange={handleAddChange}
            required
          />
          <select name="roomType" value={addForm.roomType} onChange={handleAddChange}>
            <option value="single">Single</option>
            <option value="shared">Shared</option>
          </select>
          {addForm.roomType === "shared" && (
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              min="2"
              value={addForm.capacity}
              onChange={handleAddChange}
              required
            />
          )}
          <button type="submit" className="form-submit-btn">
            Add Room
          </button>
        </form>
      </div>

      {/* Allot Room */}
      <div className="rooms-section">
        <h3 className="tab-heading">Allot Room</h3>
        <form onSubmit={handleAllotSubmit} className="inline-form">
          <select name="studentId" value={allotForm.studentId} onChange={handleAllotChange} required>
            <option value="">-- Select Student --</option>
            {unallottedStudents.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} — {s.email}
              </option>
            ))}
          </select>
          <select name="roomId" value={allotForm.roomId} onChange={handleAllotChange} required>
            <option value="">-- Select Room --</option>
            {availableRooms.map((r) => (
              <option key={r._id} value={r._id}>
                Room {r.roomNumber} ({formatOccupancy(r).length}/{r.capacity})
              </option>
            ))}
          </select>
          <button type="submit" className="form-submit-btn">
            Allot
          </button>
        </form>
      </div>

      {/* Rooms List */}
      <div className="rooms-section">
        <h3 className="tab-heading">Rooms ({rooms.length})</h3>

        {rooms.length === 0 ? (
          <div className="empty-state">
            <p>No rooms added yet.</p>
          </div>
        ) : (
          <div className="rooms-grid">
            {rooms.map((r) => {
              const roomStudents = formatOccupancy(r);
              const occupied = roomStudents.length;
              const isFull = occupied >= r.capacity;
              return (
                <div className="room-card" key={r._id}>
                  <div className="room-card-top">
                    <h4>Room {r.roomNumber}</h4>
                    <span className={`status-tag ${isFull ? "status-rejected" : "status-approved"}`}>
                      {isFull ? "Full" : "Available"}
                    </span>
                  </div>
                  <p className="room-card-type">{r.roomType}</p>
                  <p className="room-card-occupancy">
                    {occupied} / {r.capacity} occupied
                  </p>

                  {occupied > 0 && (
                    <ul className="room-card-students">
                      {roomStudents.map((s) => (
                        <li key={s._id}>{s.name}</li>
                      ))}
                    </ul>
                  )}

                  <div className="room-card-actions">
                    <button className="edit-btn" onClick={() => openEdit(r)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(r._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingRoom && (
        <Modal isOpen={true} onClose={() => setEditingRoom(null)} title="Edit Room">
          <form onSubmit={handleEditSubmit} className="simple-form">
            <div className="form-group">
              <label>Room Number</label>
              <input
                type="text"
                name="roomNumber"
                value={editForm.roomNumber}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Room Type</label>
              <select name="roomType" value={editForm.roomType} onChange={handleEditChange}>
                <option value="single">Single</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            {editForm.roomType === "shared" && (
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  min="2"
                  value={editForm.capacity}
                  onChange={handleEditChange}
                  required
                />
              </div>
            )}
            <button type="submit" className="form-submit-btn full-width">
              Save Changes
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default RoomsTab;