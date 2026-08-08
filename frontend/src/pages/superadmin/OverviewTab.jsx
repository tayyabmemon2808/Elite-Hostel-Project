import { useEffect, useState } from "react";
import api from "../../services/Api";
import Loader from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";

const OverviewTab = () => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [subAdmins, setSubAdmins] = useState([]);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
       const [
  hostelsRes,
  roomsRes,
  complaintsRes,
  bookingsRes,
  subAdminsRes
] = await Promise.all([
  api.get("/hostels/all"),
  api.get("/rooms/all"),
  api.get("/complaints/all"),
  api.get("/bookings/all"),
  api.get("/auth/subadmins"),
]);
        setHostels(hostelsRes.data);
        setRooms(roomsRes.data);
        setComplaints(complaintsRes.data);
        setBookings(bookingsRes.data);
        setSubAdmins(subAdminsRes.data);
      } catch {
        showToast("Failed to load overview data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <Loader text="Loading overview..." />;

 const totalStudents = rooms.reduce(
  (count, room) => count + (room.studentsAllotted?.length || 0),
  0
);
const occupiedRooms = rooms.filter(
  (room) => room.studentsAllotted?.length > 0
).length;

const availableRooms = rooms.length - occupiedRooms;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const pendingComplaints = complaints.filter((c) => c.status === "pending").length;

  const hostelBreakdown = hostels.map((hostel) => {
    const hostelRooms = rooms.filter((r) => r.hostel === hostel._id || r.hostel?._id === hostel._id);
    const hostelComplaints = complaints.filter(
      (c) => c.hostel === hostel._id || c.hostel?._id === hostel._id
    );
    const hostelBookings = bookings.filter(
      (b) => b.hostel === hostel._id || b.hostel?._id === hostel._id
    );
    return {
      name: hostel.name,
      roomCount: hostelRooms.length,
      pendingComplaints: hostelComplaints.filter((c) => c.status === "pending").length,
      pendingBookings: hostelBookings.filter((b) => b.status === "pending").length,
    };
  });

  return (
    <div className="overview-tab">
      {toast && <Error message={toast.message} type={toast.type} />}

      <div className="overview-cards">
        <div className="overview-card">
          <h2>{hostels.length}</h2>
          <p>Total Hostels</p>
        </div>
        <div className="overview-card">
          <h2>{rooms.length}</h2>
          <p>Total Rooms</p>
        </div>
        <div className="overview-card">
          <h2>{totalStudents}</h2>
          <p>Total Students</p>
        </div>
        <div className="overview-card">
          <h2>{pendingBookings}</h2>
          <p>Pending Bookings</p>
        </div>
        <div className="overview-card">
          <h2>{pendingComplaints}</h2>
          <p>Pending Complaints</p>
        </div>
        <div className="overview-card">
  <h2>{subAdmins.length}</h2>
  <p>Total Sub Admins</p>
</div>
<div className="overview-card">
  <h2>{occupiedRooms}</h2>
  <p>Occupied Rooms</p>
</div>
<div className="overview-card">
  <h2>{availableRooms}</h2>
  <p>Available Rooms</p>
</div>
      </div>

      <h3 className="group-title">Hostel-wise Breakdown</h3>
      <table className="overview-table">
        <thead>
          <tr>
            <th>Hostel</th>
            <th>Rooms</th>
            <th>Pending Complaints</th>
            <th>Pending Bookings</th>
          </tr>
        </thead>
        <tbody>
          {hostelBreakdown.map((h, idx) => (
            <tr key={idx}>
              <td>{h.name}</td>
              <td>{h.roomCount}</td>
              <td>{h.pendingComplaints}</td>
              <td>{h.pendingBookings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OverviewTab;