import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0d6efd,#6610f2)",
      }}
    >
      <div
        className="text-center text-white"
        style={{
          maxWidth: "700px",
        }}
      >
        <h1 className="display-3 fw-bold">
          ChatSphere
        </h1>

        <p className="lead mt-4">
          Secure Real-Time Messaging
          Platform built using
          MERN Stack and Socket.IO
        </p>

        <div className="mt-4">
          <h5>
            Features
          </h5>

          <p>
            ✓ Private Chat
            <br />
            ✓ Group Chat
            <br />
            ✓ Message Encryption
            <br />
            ✓ OTP Verification
            <br />
            ✓ Read Receipts
            <br />
            ✓ Message Editing
            <br />
            ✓ Message Deletion
            <br />
            ✓ Online Users
          </p>
        </div>

        <div className="mt-4">
          <Link
            to="/login"
            className="btn btn-light btn-lg me-3"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="btn btn-warning btn-lg"
          >
            Register
          </Link>
        </div>

        <div className="mt-5">
          <small>
            Built with React,
            Node.js, Express,
            MongoDB and Socket.IO
          </small>
        </div>
        <div className="mt-4">
  <Link
    to="/admin-login"
    className="text-white"
  >
    Admin Login
  </Link>
</div>
      </div>
    </div>
  );
}

export default Home;