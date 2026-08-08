import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import BookingRequests from "./BookingRequest";
import RoomsTab from "./RoomsTab";
import StudentsTab from "./StudentTab";
import ComplaintsTab from "./ComplaintsTab";
import "./SubAdminDashboard.css";
import { getUser } from "../../utils/auth";
import Loader from "../../components/Loader/Loader";

function SubAdminDashboard() {
  const user = getUser();
  const [activeTab, setActiveTab] = useState("bookings");

  if (!user) {
    return <Loader text="Redirecting..." />;
  }
  return (
    <div className="subadmin-dashboard">
      <Navbar />

      <div className="dashboard-container">
        <h2>Sub-Admin Dashboard</h2>

        <div className="dashboard-tabs">
          <button
            className={activeTab === "bookings" ? "tab active" : "tab"}
            onClick={() => setActiveTab("bookings")}
          >
            Booking Requests
          </button>
          <button
            className={activeTab === "rooms" ? "tab active" : "tab"}
            onClick={() => setActiveTab("rooms")}
          >
            Rooms
          </button>
          <button
            className={activeTab === "students" ? "tab active" : "tab"}
            onClick={() => setActiveTab("students")}
          >
            Students
          </button>
          <button
            className={activeTab === "complaints" ? "tab active" : "tab"}
            onClick={() => setActiveTab("complaints")}
          >
            Complaints
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === "bookings" && <BookingRequests />}
          {activeTab === "rooms" && <RoomsTab />}
          {activeTab === "students" && <StudentsTab />}
          {activeTab === "complaints" && <ComplaintsTab />}
        </div>
      </div>
    </div>
  );
}

export default SubAdminDashboard;