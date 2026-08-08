import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import HostelDetail from "./pages/public/HostelDetail";
import BookingForm from "./pages/public/BookingForm";
import CheckStatus from "./pages/public/CheckStatus";
import Signup from "./pages/public/Signup";
import StudentDashboard from "./pages/student/StudentDashboard";
import SubAdminDashboard from "./pages/subadmin/SubAdminDashboard";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute"

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
        <Route path="/student/dashboard" element=
        {
          <ProtectedRoute allowedRole="student">
        <StudentDashboard />
        </ProtectedRoute>
        } />
        <Route path="/subadmin/dashboard" element={
          <ProtectedRoute allowedRole="subadmin">
          <SubAdminDashboard />
          </ProtectedRoute>        
          } />
        <Route path="/superadmin/dashboard" element={
          <ProtectedRoute allowedRole="superadmin">
          <SuperAdminDashboard />
          </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;