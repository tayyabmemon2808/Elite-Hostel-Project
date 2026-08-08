import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import HostelsTab from "./HostelTab";
import CreateSubAdminTab from "./CreateSubAdminTab";
import OverviewTab from "./OverviewTab";
import { getUser } from "../../utils/auth";
import "./SuperAdminDashboard.css";
import Loader from "../../components/Loader/Loader";

const SuperAdminDashboard = () => {
   const user = getUser();
  const [activeTab, setActiveTab] = useState("hostels");

   if (!user) {
    return <Loader text="Redirecting..." />;
  }
  return (
    <>
      <Navbar />
      <div className="sa-dashboard">
        <h1 className="tab-heading">Super Admin Dashboard</h1>

        <div className="sa-tab-buttons">
          <button
            className={activeTab === "hostels" ? "active" : ""}
            onClick={() => setActiveTab("hostels")}
          >
            Hostels
          </button>
          <button
            className={activeTab === "createsubadmin" ? "active" : ""}
            onClick={() => setActiveTab("createsubadmin")}
          >
         Sub-Admins
          </button>
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
        </div>

        <div className="sa-tab-content">
          {activeTab === "hostels" && <HostelsTab />}
          {activeTab === "createsubadmin" && <CreateSubAdminTab />}
          {activeTab === "overview" && <OverviewTab />}
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;