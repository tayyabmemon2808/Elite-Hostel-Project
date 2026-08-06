import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import HostelDetail from "./pages/public/HostelDetail";
import BookingForm from "./pages/public/BookingForm";
import CheckStatus from "./pages/public/CheckStatus";
import Signup from "./pages/public/Signup";


const StudentDashboard = () => <h1>Student Dashboard</h1>;
const SubAdminDashboard = () => <h1>Sub-Admin Dashboard</h1>;
const SuperAdminDashboard = () => <h1>Super Admin Dashboard</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/hostels/:id" element={<HostelDetail />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/book/:hostelId" element={<BookingForm />} />
        <Route path="/check-status" element={<CheckStatus />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/subadmin/dashboard" element={<SubAdminDashboard />} />
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;