import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import GroupChat from "./pages/GroupChat";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLogin
from "./pages/AdminLogin";
import Home from "./pages/Home";
import VerifyOtp from "./pages/VerifyOtp";
import Profile from "./pages/Profile";
import AdminDashboard
from "./pages/AdminDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/verify-otp"
          element={
            <VerifyOtp />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <GroupChat />
            </ProtectedRoute>
          }
        />
        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
        <Route
  path="/admin-login"
  element={
    <AdminLogin />
  }
/>

<Route
  path="/admin-dashboard"
  element={
    localStorage.getItem(
      "adminToken"
    )
      ? (
        <AdminDashboard />
      )
      : (
        <Navigate
          to="/admin-login"
        />
      )
  }
/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;