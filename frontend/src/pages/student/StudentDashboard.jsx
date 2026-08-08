import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import MyRoom from "../student/MyRoom";
import FileComplaint from "../student/FileComplain";
import MyComplaints from "../student/MyComplaint";
import MyStayHistory from "../student/MyStayHistory";
import "./StudentDashboard.css";
import { getUser } from "../../utils/auth";
import Loader from "../../components/Loader/Loader";
function StudentDashboard() {
  const user = getUser();
  const [activeTab, setActiveTab] = useState("room");

  if (!user) {
    return <Loader text="Redirecting..." />;
  }
  return (
    <div className="student-dashboard">
      <Navbar />

      <div className="dashboard-container">
        <h2>Student Dashboard</h2>

        <div className="dashboard-tabs">
          <button
            className={activeTab === "room" ? "tab active" : "tab"}
            onClick={() => setActiveTab("room")}
          >
            My Room
          </button>
          <button
            className={activeTab === "file" ? "tab active" : "tab"}
            onClick={() => setActiveTab("file")}
          >
            File a Complaint
          </button>
          <button
            className={activeTab === "complaints" ? "tab active" : "tab"}
            onClick={() => setActiveTab("complaints")}
          >
            My Complaints
          </button>
          <button
            className={activeTab === "history" ? "tab active" : "tab"}
            onClick={() => setActiveTab("history")}
          >
            Stay History
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === "room" && <MyRoom />}
          {activeTab === "file" && <FileComplaint />}
          {activeTab === "complaints" && <MyComplaints />}
          {activeTab === "history" && <MyStayHistory />}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
