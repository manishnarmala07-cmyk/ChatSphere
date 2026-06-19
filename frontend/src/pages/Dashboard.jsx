import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } =
    useAuth();

  return (
    <div className="container mt-5">
      <h2>Dashboard</h2>

      <h4>
        Welcome {user?.name}
      </h4>

      <button
        className="btn btn-danger"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;